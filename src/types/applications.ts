import { ReactNode } from "react";
import { FieldValue } from "firebase/firestore";

export type FirestoreTimestamp = string | FieldValue;

export type FirestoreApplicationPayload = Omit<
  JobApplicationPayload,
  "createdAt" | "updatedAt"
> & {
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
};

export type FirestoreCreateApplicationDTO = Omit<
  CreateApplicationDTO,
  "createdAt" | "updatedAt"
> & {
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
};

export type ApplicationPriority = "low" | "med" | "high";

export interface TimelineEvent {
  id: string;
  logo: string;
  title: string;
  date: Date;
  isoDate: string;
  location: string;
  isToday: boolean;
  color: string;
}

export interface StatCardProps {
  label: string;
  count: number;
  color: string;
}

export type ApplicationFormState = {
  companyName: string;
  position: string;
  platform: Platform;
  jobUrl: string;
  status: ApplicationStatus;
  appliedAt: string;
  location: string;
  employmentType: EmploymentType;
  notes: string;

  stageTitle: string;
  stageNotes: string;
  scheduledAt: string;

  rejectionReason: string;
  rejectedAt: string;
};

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
  APPLIED = "applied",
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

export interface PatchApplicationPayload {
  employmentType: EmploymentType;
  status: ApplicationStatus;
  priority: "low" | "medium" | "high";
  notes: string;
  stages: ApplicationStage[];
  updatedAt: string;
}

export interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  count: number;
  color: "red" | "blue" | "emerald";
}

export type CreateApplicationDTO = Omit<JobApplicationPayload, "id">;
