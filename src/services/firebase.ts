import { CreateApplicationDTO } from "@/types/applications";

export async function createApply(data: CreateApplicationDTO) {
	const res = await fetch("/api/applications/create", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	const result = await res.json();
	if (!res.ok) throw new Error(result.message || "Failed to create application");
	return result;
}

export async function getApplications(url: string){
	const res = await fetch(url, {
    // cache: "force-cache",
    next: {
      tags: ["applications"],
      // revalidate: 30
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

