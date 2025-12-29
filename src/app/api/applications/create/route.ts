import { NextResponse } from "next/server";
import { createApplication } from "@/lib/firebase/service";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const result = await createApplication(body);
		return NextResponse.json({ status: true, data: result }, { status: 201 });
	} catch {
		return NextResponse.json({ status: false, message: "Server Error" }, { status: 500 });
	}
}