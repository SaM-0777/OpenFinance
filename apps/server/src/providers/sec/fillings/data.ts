import { XMLParser } from "fast-xml-parser";

export interface Holding {
  issuer: string;
  cusip: string;
  titleOfClass: string | null;
  value: number;
  shares: number;
  reportPeriod: string;
  filingDate: string;
  shareType: string | null;
  optionType: string | null;
  investmentDiscretion: string | null;
  otherManager: string | null;
  votingAuthoritySole: number;
  votingAuthorityShared: number;
  votingAuthorityNone: number;
}

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "Accept-Encoding": "gzip, deflate, br",
  Accept: "application/json,text/plain,application/xml,text/xml",
  cookie: process.env.SEC_COOKIE!,
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
});

export async function getSECHoldings(cik: string): Promise<Holding[]> {
  try {
    const paddedCik = cik.padStart(10, "0");

    const submissionUrl = `https://data.sec.gov/submissions/CIK${paddedCik}.json`;
    const submissionReq = await fetch(submissionUrl, { headers });

    if (!submissionReq.ok) {
      throw new Error(
        `Failed to fetch SEC submission (${submissionReq.status})`,
      );
    }

    const submission = await submissionReq.json();
    const recent = submission?.filings?.recent;

    if (!recent) {
      throw new Error(`No recent filings found for CIK ${cik}`);
    }

    const filingIndex = recent.form.findIndex(
      (form: string) => form === "13F-HR",
    );

    if (filingIndex === -1) {
      throw new Error(`No 13F-HR filing found for CIK ${cik}`);
    }

    const accessionNumber = recent.accessionNumber[filingIndex];
    const filingDate = recent.filingDate[filingIndex];
    const reportPeriod = recent.reportDate[filingIndex];
    const cikWithoutLeadingZeros = String(Number(cik));
    const accessionWithoutDashes = accessionNumber.replaceAll("-", "");

    const txtUrl = `https://www.sec.gov/Archives/edgar/data/${cikWithoutLeadingZeros}/${accessionWithoutDashes}/${accessionNumber}.txt`;
    const txtReq = await fetch(txtUrl, {
      headers,
    });

    if (!txtReq.ok) {
      throw new Error(`Failed to fetch SEC TXT (${txtReq.status})`);
    }

    const txt = await txtReq.text();

    const infoTableMatch = txt.match(
      /<DOCUMENT>\s*<TYPE>INFORMATION TABLE[\s\S]*?<XML>([\s\S]*?)<\/XML>[\s\S]*?<\/DOCUMENT>/i,
    );

    if (!infoTableMatch?.[1]) {
      throw new Error("INFORMATION TABLE document not found");
    }

    const informationTableXml = infoTableMatch[1].trim();

    const parsed = parser.parse(informationTableXml);

    const infoTables = parsed?.informationTable?.infoTable ?? [];

    const rows = Array.isArray(infoTables) ? infoTables : [infoTables];

    const result = rows
      .map((holding: any) => ({
        issuer: holding.nameOfIssuer?.trim() ?? "",
        cusip: String(holding.cusip ?? "").trim(),
        titleOfClass: holding.titleOfClass?.trim() ?? null,
        value: Number(holding.value ?? 0) * 1000,
        shares: Number(holding?.shrsOrPrnAmt?.sshPrnamt ?? 0),
        reportPeriod,
        filingDate,
        shareType: holding?.shrsOrPrnAmt?.sshPrnamtType ?? null,
        optionType: holding.putCall ?? null,
        investmentDiscretion: holding.investmentDiscretion ?? null,
        otherManager: holding.otherManager?.toString()?.trim() ?? null,
        votingAuthoritySole: Number(
          holding?.votingAuthority?.Sole ?? holding?.votingAuthority?.sole ?? 0,
        ),
        votingAuthorityShared: Number(
          holding?.votingAuthority?.Shared ??
            holding?.votingAuthority?.shared ??
            0,
        ),
        votingAuthorityNone: Number(
          holding?.votingAuthority?.None ?? holding?.votingAuthority?.none ?? 0,
        ),
      }))
      .filter((holding) => holding.cusip.length > 0) as Holding[];

    return result;
  } catch (error) {
    throw new Error(`providers.sec.getHoldings.error ${String(error)}`);
  }
}
