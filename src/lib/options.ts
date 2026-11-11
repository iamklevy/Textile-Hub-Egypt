// Stable keys stored in the database. Labels live in src/dictionaries/*.

export const cities = [
  "tenth_of_ramadan",
  "obour",
  "mahalla",
  "shubra_el_kheima",
  "borg_el_arab",
  "qantara_west",
  "ain_sokhna_teda",
  "sadat_city",
  "sixth_of_october",
  "port_said",
  "alexandria",
  "cairo",
  "giza",
  "minya",
  "other",
] as const;

export const companyCategories = [
  "spinning",
  "weaving",
  "knitting",
  "dyeing_finishing",
  "printing",
  "garments",
  "home_textiles",
  "trims_accessories",
  "packaging",
  "services",
] as const;

export const openToOptions = [
  "subcontracting",
  "supply",
  "joint_venture",
  "factory_lease",
  "factory_sale",
] as const;

export const jobRoles = [
  "line_supervisor",
  "maintenance_mechanic",
  "sewing_operator",
  "pattern_maker",
  "cutter",
  "quality_control",
  "merchandiser",
  "production_manager",
  "dyeing_technician",
  "translator_coordinator",
  "other",
] as const;

export const jobTypes = ["full_time", "part_time", "contract"] as const;

export const machineCategories = [
  "sewing",
  "cutting",
  "knitting",
  "weaving",
  "spinning",
  "dyeing_finishing",
  "printing",
  "embroidery",
  "pressing",
  "other",
] as const;

export const machineConditions = [
  "like_new",
  "good",
  "working",
  "needs_repair",
] as const;

export const investorInterests = [
  "find_subcontractors",
  "factory_or_land",
  "joint_venture",
  "hiring_team",
  "buy_machinery",
  "legal_setup",
] as const;
