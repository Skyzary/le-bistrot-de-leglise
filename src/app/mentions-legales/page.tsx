import React from 'react';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';

export default function MentionsLegales() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '64px' }}>
      <Header />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 16px', color: 'rgba(249, 246, 240, 0.8)', lineHeight: '1.6' }}>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '32px', color: 'var(--color-primary)', marginBottom: '24px' }}>Mentions Légales</h1>
        
        <h2 style={{ color: 'var(--color-parchment)', marginTop: '24px', marginBottom: '8px' }}>Éditeur du site</h2>
        <p>Le Bistrot de l'Église<br/>4 place du 11 novembre 1918, 34690 Fabrègues<br/>Téléphone : 04 34 11 75 85<br/>Email : contact@lebistrotdeleglise.fr</p>
        
        <h2 style={{ color: 'var(--color-parchment)', marginTop: '24px', marginBottom: '8px' }}>Hébergement</h2>
        <p>Le site est hébergé conformément aux lois en vigueur en France.</p>
        
        <h2 style={{ color: 'var(--color-parchment)', marginTop: '24px', marginBottom: '8px' }}>Propriété Intellectuelle</h2>
        <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.</p>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <Footer />
      </div>
    </main>
  );
}
