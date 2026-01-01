import { NextResponse } from "next/server";
import { deleteApplication } from "@/lib/firebase/service";
import { revalidateTag } from "next/cache";

export async function DELETE(request: Request, { params }) {
    const { id } = await params;
    try {
        await deleteApplication(id);
        revalidateTag("applications");
        return NextResponse.json({ message: "Data deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 });
  }
}
