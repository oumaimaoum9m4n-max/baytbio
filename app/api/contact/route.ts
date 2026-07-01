import { NextResponse } from "next/server";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxMIwQ04r42JFDlwvjSfTEMsTmGo13Leh069YPmIKyoSjTtEI0DRn-edwtN2QSJapot/exec";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const formData = new FormData();

    formData.append("name", body.name || "");
    formData.append("phone", body.phone || "");
    formData.append("email", body.email || "");
    formData.append("subject", body.subject || "");
    formData.append("message", body.message || "");

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: formData,
    });

    const text = await response.text();

console.log(text);

return NextResponse.json({
  success: true,
  googleResponse: text,
});


  



  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}
