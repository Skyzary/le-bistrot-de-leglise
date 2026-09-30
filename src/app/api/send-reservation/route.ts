import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Missing RESEND_API_KEY");
      return NextResponse.json({ success: false, error: 'Configuration serveur invalide.' }, { status: 500 });
    }

    const formData = await request.formData();
    const guests = formData.get('guests');
    const date = formData.get('date');
    const time = formData.get('time');
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const location = formData.get('location');
    const requests = formData.get('requests') as string | null;

    if (!name || !phone || !email || !date || !time) {
      return NextResponse.json({ success: false, error: 'Champs obligatoires manquants.' }, { status: 400 });
    }

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 20px; border-radius: 10px;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <h2 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #b78c43; padding-bottom: 12px; font-size: 24px;">Nouvelle Réservation - Le Bistrot</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tbody>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                  <span style="color: #7f8c8d; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Nom du client</span>
                  <strong style="color: #2c3e50; font-size: 16px;">${name}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                  <span style="color: #7f8c8d; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Date & Heure</span>
                  <strong style="color: #2c3e50; font-size: 16px;">Le ${date} à ${time}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                  <span style="color: #7f8c8d; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Détails de la table</span>
                  <strong style="color: #2c3e50; font-size: 16px;">${guests} personnes — ${location === 'terrace' ? 'En terrasse' : 'En salle'}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                  <span style="color: #7f8c8d; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Coordonnées</span>
                  <strong style="color: #2c3e50; font-size: 16px;">
                    <a href="tel:${phone}" style="color: #b78c43; text-decoration: none;">${phone}</a><br>
                    <a href="mailto:${email}" style="color: #b78c43; text-decoration: none;">${email}</a>
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 25px; padding: 15px; background-color: #fdfbf7; border-left: 4px solid #b78c43; border-radius: 4px;">
            <span style="color: #7f8c8d; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">Demandes particulières</span>
            <p style="color: #34495e; font-size: 15px; margin: 0; line-height: 1.5;">${requests ? requests.replace(/\n/g, "<br>") : "<em>Aucune demande spécifique.</em>"}</p>
          </div>

          <div style="margin-top: 30px; text-align: center; font-size: 13px; color: #95a5a6;">
            Cet email a été envoyé automatiquement depuis le site web Le Bistrot de l'Église.
          </div>
        </div>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `Réservation Le Bistrot <notifications@reservation.lebistrotdeleglise.fr>`,
        to: ["valeresicot@yahoo.fr"],
        subject: `Réservation - ${name} - ${date} à ${time}`,
        html: htmlContent,
        reply_to: email as string,
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API Error:", data);
      return NextResponse.json({ success: false, error: data.message || 'Erreur API' }, { status: 400 });
    }

    console.log("mail sent", data);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
