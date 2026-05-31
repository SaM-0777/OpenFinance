import { XMLParser } from "fast-xml-parser";

export interface Holding {
  issuer: string;
  cusip: string;
  value: number;
  shares: number;
  reportPeriod: string;
  filingDate: string;
  shareType: string | null;
  optionType: string | null;
  investmentDiscretion: string | null;
}

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "Accept-Encoding": "gzip, deflate, br",
  Accept: "application/xml,text/xml,text/html",
  cookie: process.env.SEC_COOKIE!,
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",

  parseTagValue: false,
  parseAttributeValue: false,

  trimValues: true,
});

export async function getSECHoldings(filingUrl: string): Promise<Holding[]> {
  try {
    const baseDir = filingUrl.replace(/\/[^/]+-index\.htm$/, "");

    const filingPageReq = await fetch(filingUrl, {
      headers,
    });

    if (!filingPageReq.ok) {
      throw new Error(`Failed to fetch filing page (${filingPageReq.status})`);
    }

    const filingHtml = await filingPageReq.text();

    const filingDate =
      filingHtml
        .match(
          /Filing Date[\s\S]*?<div[^>]*class="info"[^>]*>(.*?)<\/div>/i,
        )?.[1]
        ?.trim() ?? null;

    const reportPeriod =
      filingHtml
        .match(
          /Period of Report[\s\S]*?<div[^>]*class="info"[^>]*>(.*?)<\/div>/i,
        )?.[1]
        ?.trim() ?? null;

    const indexReq = await fetch(`${baseDir}/index.json`, {
      headers,
    });

    if (!indexReq.ok) {
      throw new Error(`Failed to fetch index.json (${indexReq.status})`);
    }

    const indexJson = await indexReq.json();

    const files = indexJson?.directory?.item ?? [];
    const infoTableFile = files.find((file: any) => {
      const name = file.name?.toLowerCase() ?? "";

      return (
        name.endsWith(".xml") &&
        (name.includes("infotable") || name.includes("informationtable"))
      );
    });

    if (!infoTableFile) {
      throw new Error("Information Table XML not found");
    }

    const infoTableUrl = `${baseDir}/${infoTableFile.name}`;
    const xmlReq = await fetch(infoTableUrl, {
      headers,
    });

    if (!xmlReq.ok) {
      throw new Error(`Failed to fetch holdings XML (${xmlReq.status})`);
    }

    const xml = await xmlReq.text();
    const parsed = parser.parse(xml);

    const infoTables = parsed?.informationTable?.infoTable ?? [];
    const rows = Array.isArray(infoTables) ? infoTables : [infoTables];

    return rows
      .map((holding: any) => ({
        issuer: holding.nameOfIssuer ?? "",
        cusip: String(holding.cusip ?? "").trim(),
        value: Number(holding.value ?? 0) * 1000,
        shares: Number(holding?.shrsOrPrnAmt?.sshPrnamt ?? 0),
        reportPeriod,
        filingDate,
        shareType: holding?.shrsOrPrnAmt?.sshPrnamtType ?? null,
        optionType: holding.putCall ?? null,
        investmentDiscretion: holding.investmentDiscretion ?? null,
      }))
      .filter(
        (h) => Boolean(h.filingDate) && Boolean(h.reportPeriod),
      ) as Holding[];
  } catch (error) {
    throw new Error(`providers.sec.getHoldings.error ${String(error)}`);
  }
}
