import { XMLParser } from "fast-xml-parser";

export interface Companies {
  id: string;
  cik: string;
  fundName: string;
  managerName: string | null;
  filingDate: string | null | undefined;
  formType: string;
  link: string;
}

const SEC_USER_AGENT = process.env.SEC_USER_AGENT;

export async function getSECFillings({ count }: { count: number }) {
  const url = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=13F-HR&count=${count}&output=atom`;
  try {
    const req = await fetch(url, {
      headers: {
        "User-Agent": SEC_USER_AGENT!,
        "Accept-Encoding": "gzip, deflate, br, zstd",
        Host: "www.sec.gov",
        Accept: "application/atom+xml, application/xml",
        "cache-control": "max-age=0",
        "accept-language": "en-US,en;q=0.9",
        cookie: process.env.SEC_COOKIE!,
      },
    });

    if (!req.ok) {
      throw new Error(`SEC API returned status: ${req.status}`);
    }

    const xmlData = await req.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const result = parser.parse(xmlData);

    const entries = result.feed?.entry || [];
    const entriesArray = Array.isArray(entries) ? entries : [entries];

    const data: Companies[] = entriesArray
      .map((entry: any) => {
        const titleMatch = entry.title?.match(/(.*?)\s+-\s+(.*?)\s+\((.*?)\)/);

        return {
          id: entry.id,
          fundName: titleMatch ? titleMatch[2].trim() : entry.title,
          managerName: "N/A",
          cik: titleMatch ? titleMatch[3] : "Unknown",
          filingDate: entry.updated,
          formType: entry.category?.["@_term"] || "13F-HR/A",
          link: entry.link?.["@_href"] || "",
        };
      })
      .filter((c) => Boolean(c.cik));

    return data;
  } catch (error) {
    throw new Error(`providers.sec.gerSECFillings.error ${error}`);
  }
}
