import { NextResponse, NextRequest } from "next/server";
import { getApplicationsByUserId } from "@/lib/firebase/service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const applications = await getApplicationsByUserId(userId);

    if (!applications) {
      return NextResponse.json(
        { status: 404, message: "Not found", data: {} },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Success",
      data: applications,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server Error";

    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}
