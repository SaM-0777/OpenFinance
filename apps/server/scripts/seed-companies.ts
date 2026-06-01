import { CompanySchema, db, sql } from "@openfinance/shared/db";

const Companies = [
  {
    cik: "0001350694",
    name: "Bridgewater Associates",
    manager: "Ray Dalio / Karen Karniol-Tambour",
    address: "ONE NYALA FARMS ROAD, WESTPORT, CT, 06880",
    link: "https://www.bridgewater.com",
    state: "CT",
  },
  {
    cik: "0001273087",
    name: "Millennium Management",
    manager: "Israel (Izzy) Englander",
    address: "399 PARK AVENUE, NEW YORK, NY, 10022",
    link: "https://www.mlp.com",
    state: "NY",
  },
  {
    cik: "0001423053",
    name: "Citadel Advisors",
    manager: "Ken Griffin",
    address: "830 BRICKELL PLAZA, MIAMI, FL, 33131",
    link: "https://www.citadel.com",
    state: "FL",
  },
  {
    cik: "0001791786",
    name: "Elliott Investment Management",
    manager: "Paul Singer",
    address: "360 S. ROSEMARY AVE, 18TH FLOOR, WEST PALM BEACH, FL, 33401",
    link: "https://www.elliottmgmt.com",
    state: "FL",
  },
  {
    cik: "0001067983",
    name: "Berkshire Hathaway Inc",
    manager: "Warren Buffett",
    address: "33555 FARNAM STREET, OMAHA, NE, 68131",
    link: "https://www.berkshirehathaway.com",
    state: "NE",
  },
  {
    cik: "0001336528",
    name: "Pershing Square Capital Management",
    manager: "Bill Ackman",
    address: "787 11TH AVENUE, 9TH FLOOR, NEW YORK, NY, 10019",
    link: "https://pershingsquareholdings.com",
    state: "NY",
  },
  {
    cik: "0002045724",
    name: "Situational Awareness LP",
    manager: "Leopold Aschenbrenner",
    address: "77 FEDERAL STREET, 4TH FLOOR, SAN FRANCISCO, CA, 94107",
    link: "https://situationalawarenesslp.com",
    state: "CA",
  },
  {
    cik: "0001037389",
    name: "Renaissance Technologies",
    manager: "Peter Brown",
    address: "800 THIRD AVE, NEW YORK, NY, 10022",
    link: "https://www.rentec.com",
    state: "NY",
  },
  {
    cik: "0001023870",
    name: "D.E. Shaw & Co",
    manager: "David E. Shaw",
    address: "120 WEST FORTY-FIFTH STREET, 39TH FLOOR, NEW YORK, NY, 10036",
    link: "https://www.deshaw.com",
    state: "NY",
  },
  {
    cik: "0001179392",
    name: "Two Sigma Investments",
    manager: "John Overdeck & David Siegel",
    address: "100 AVENUE OF THE AMERICAS, 16TH FLOOR, NEW YORK, NY, 10013",
    link: "https://www.twosigma.com",
    state: "NY",
  },
];

export async function seedCompanies() {
  try {
    await db
      .insert(CompanySchema)
      .values(Companies)
      .onConflictDoNothing()
      .returning();
  } catch (error) {
    console.error({
      message: error?.message,
      cause: error?.cause,
    });
    throw new Error(`Failed to seed companies`);
  }
}

await seedCompanies();
