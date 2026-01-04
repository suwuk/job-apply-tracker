import { NextResponse } from "next/server";
import { deleteApplication, patchApplication } from "@/lib/firebase/service";
import { revalidateTag } from "next/cache";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, { params }) {
  const { id } = await params;
  try {
    await deleteApplication(id);
    revalidateTag("applications");
    return NextResponse.json(
      { message: "Data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: RouteContext 
) {
  try {
    const body = await req.json();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "ID lamaran tidak ditemukan" },
        { status: 400 }
      );
    }

    await patchApplication(id, body);

    return NextResponse.json(
      {
        status: true,
        message: "Lamaran berhasil diperbarui",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: error.message || "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}
