import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
import QRCode from "https://esm.sh/qrcode"
import {corsHeaders} from "../_shared/cors.ts";

type QRRequest = {
    text: String,
    margin: number,
    scale: number,
    color: {
        dark: string,
        light: string,
    }
}

async function generateQR(request: QRRequest): Promise<Response> {
    try {
        const qrcode = await QRCode.toString(
            request.text,
            {type: 'image/svg', margin: request.margin, scale: request.scale, color: request.color}
        );
        return new Response(
            qrcode,
            {headers: {...corsHeaders, "Content-Type": "image/svg"}},
        );
    } catch (e) {
        return new Response(
            e,
            { status: 400 },
        );
    }
}

serve(async (req): Promise<Response> => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    let request: QRRequest = await req.json();
    return generateQR(request);
})