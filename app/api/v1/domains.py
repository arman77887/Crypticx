import re
from urllib.parse import quote

import httpx
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

RDAP_BOOTSTRAP_URL = "https://data.iana.org/rdap/dns.json"

DOMAIN_REGEX = re.compile(
    r"^(?=.{1,253}$)"
    r"(?:[a-zA-Z0-9]"
    r"(?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+"
    r"[a-zA-Z]{2,63}$"
)


def normalize_domain(domain: str) -> str:
    domain = domain.strip().lower()

    if domain.startswith("http://"):
        domain = domain[7:]

    if domain.startswith("https://"):
        domain = domain[8:]

    domain = domain.split("/")[0]
    domain = domain.rstrip(".")

    return domain


async def get_rdap_server(domain: str) -> str | None:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(RDAP_BOOTSTRAP_URL)
            response.raise_for_status()
            data = response.json()

        tld = domain.rsplit(".", 1)[-1].lower()

        for service in data.get("services", []):
            if len(service) != 2:
                continue

            tlds, urls = service

            normalized_tlds = [
                str(item).lower().lstrip(".")
                for item in tlds
            ]

            if tld in normalized_tlds and urls:
                return str(urls[0]).rstrip("/")

        return None

    except Exception:
        return None


@router.get("/check")
async def check_domain(
    domain: str = Query(..., min_length=3, max_length=253)
):
    domain = normalize_domain(domain)

    if not DOMAIN_REGEX.match(domain):
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid domain name, for example example.com",
        )

    rdap_server = await get_rdap_server(domain)

    if not rdap_server:
        raise HTTPException(
            status_code=400,
            detail="This domain extension is not currently supported.",
        )

    rdap_url = f"{rdap_server}/domain/{quote(domain, safe='')}"

    try:
        async with httpx.AsyncClient(
            timeout=12.0,
            follow_redirects=True,
            headers={
                "Accept": "application/rdap+json, application/json",
                "User-Agent": "CrypticX-Domain-Checker/1.0",
            },
        ) as client:
            response = await client.get(rdap_url)

        if response.status_code == 200:
            return {
                "domain": domain,
                "available": False,
                "status": "registered",
                "message": "This domain is already registered.",
            }

        if response.status_code in (404, 410):
            return {
                "domain": domain,
                "available": True,
                "status": "available",
                "message": "This domain appears to be available.",
            }

        if response.status_code == 429:
            raise HTTPException(
                status_code=429,
                detail="The domain registry temporarily rate-limited the request. Please try again.",
            )

        return {
            "domain": domain,
            "available": None,
            "status": "unknown",
            "message": "The registry could not confirm availability right now.",
        }

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Domain registry request timed out. Please try again.",
        )

    except httpx.RequestError:
        raise HTTPException(
            status_code=502,
            detail="Unable to contact the domain registry.",
        )
