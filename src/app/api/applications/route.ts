import { NextResponse, NextRequest} from "next/server";
import { getApplicationsByUserId } from "@/lib/firebase/service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest){
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id
        const applications = await getApplicationsByUserId(userId);
        if (!applications){
            return NextResponse.json({status: 404, message: "Not found", data: {}})
        }
        return NextResponse.json({status: 200, message: "Success", data: applications})
    } catch {
        return NextResponse.json({ status: false, message: "Server Error" }, { status: 500 });
    }
}
