import React from 'react';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';

export default function PolitiqueConfidentialite() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '64px' }}>
      <Header />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 16px', color: 'rgba(249, 246, 240, 0.8)', lineHeight: '1.6' }}>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '32px', color: 'var(--color-primary)', marginBottom: '24px' }}>Politique de Confidentialité</h1>
        
        <h2 style={{ color: 'var(--color-parchment)', marginTop: '24px', marginBottom: '8px' }}>Qui sommes-nous ?</h2>
        <p>L’adresse de notre site Web est : https://lebistrotdeleglise.fr<br/>Email : contact@lebistrotdeleglise.fr<br/>Téléphone : 04 34 11 75 85</p>

        <h2 style={{ color: 'var(--color-parchment)', marginTop: '24px', marginBottom: '8px' }}>Utilisation des données personnelles collectées</h2>
        <p>En tout état de cause lebistrotdeleglise.fr ne collecte des informations personnelles relatives à l’utilisateur que pour le besoin de certains services proposés par le site (ex: formulaire de contact). L’utilisateur fournit ces informations en toute connaissance de cause, notamment lorsqu’il procède par lui-même à leur saisie.</p>

        <h2 style={{ color: 'var(--color-parchment)', marginTop: '24px', marginBottom: '8px' }}>Durées de stockage de vos données</h2>
        <p>Vos informations personnelles sont conservées uniquement pour le temps correspondant à la finalité de la collecte qui ne saurait excéder 36 mois.</p>

        <h2 style={{ color: 'var(--color-parchment)', marginTop: '24px', marginBottom: '8px' }}>Les droits que vous avez sur vos données</h2>
        <p>Vous pouvez demander l’effacement des données personnelles vous concernant. Cela ne prend pas en compte les données stockées à des fins administratives, légales ou pour des raisons de sécurité. Vous disposez à tout moment d’un droit d’accès, de modification, de rectification et d’effacement de vos données personnelles.</p>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <Footer />
      </div>
    </main>
  );
}
