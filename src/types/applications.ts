export type ApplicationPriority = "low" | "med" | "high";

export enum Platform {
  LINKEDIN = "linkedin",
  JOBSTREET = "jobstreet",
  INDEED = "indeed",
  GLINTS = "glints",
  KALIBRR = "kalibrr",
  COMPANY_WEBSITE = "company_website",
  EMAIL = "email",
  REFERRAL = "referral",
  TELEGRAM = "telegram",
  WHATSAPP = "whatsapp",
  OTHER = "other",
}

export enum ApplicationStatus {
  // DRAFT dihapus
  APPLIED = "applied",
  // SCREENING dihapus
  TEST = "test",
  INTERVIEW = "interview",
  OFFER = "offer",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
  GHOSTED = "ghosted",
}

export enum EmploymentType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  CONTRACT = "contract",
  INTERNSHIP = "internship",
  FREELANCE = "freelance",
  TEMPORARY = "temporary",
}

export interface ApplicationStage {
  id: string;
  type: string;
  title: string;
  status: "pending" | "completed" | "passed" | "failed" | "received";
  scheduledAt: string | null;
  completedAt: string | null;
  notes: string;
  createdAt: string;
}

export interface JobApplicationPayload {
  id?: string;
  userId: string;
  companyName: string;
  position: string;
  platform: Platform;
  jobUrl?: string | null;
  status: ApplicationStatus;
  appliedAt?: string | null;
  location?: string | null;
  employmentType?: EmploymentType | null;
  notes?: string | null;
  priority: ApplicationPriority;
  stages: ApplicationStage[];
  createdAt: string;
  updatedAt: string;
}

export type CreateApplicationDTO = Omit<JobApplicationPayload, "id">;