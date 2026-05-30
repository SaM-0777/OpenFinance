import { XMLParser } from "fast-xml-parser";
import { Context } from "hono";

const SEC_USER_AGENT = "Terminal13F_App/1.0";
const SEC_RSS_URL =
  "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=13F-HR&count=40&output=atom";

export async function getSECFillings(c: Context) {
  try {
    const req = await fetch(SEC_RSS_URL, {
      headers: {
        //"User-Agent": SEC_USER_AGENT,
        Accept: "application/atom+xml, application/xml",
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

    const data = entriesArray.map((entry: any) => {
      const titleMatch = entry.title?.match(/(.*?)\s+-\s+(.*?)\s+\((.*?)\)/);

      return {
        id: entry.id,
        fundName: titleMatch ? titleMatch[2].trim() : entry.title,
        managerName: "N/A",
        cik: titleMatch ? titleMatch[3] : "Unknown",
        filingDate: entry.updated,
        formType: "13F-HR",
        link: entry.link?.["@_href"] || "",
        ...entry
      };
    });

    return c.json(
      {
        data,
        error: null,
      },
      200,
    );
  } catch (error) {
    console.error(`controllers.sec.gerSECFillings.error ${error}`)
    return c.json(
      {
        data: null,
        error: "Internal server error",
      },
      500,
    );
  }
}
