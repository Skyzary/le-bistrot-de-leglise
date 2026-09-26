import React from 'react';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';

export default function CookiesPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '64px' }}>
      <Header />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 16px', color: 'rgba(249, 246, 240, 0.8)', lineHeight: '1.6' }}>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '32px', color: 'var(--color-primary)', marginBottom: '24px' }}>Gestion des Cookies</h1>
        
        <p style={{ marginBottom: '16px' }}>Pour offrir les meilleures expériences, nous utilisons des technologies telles que les cookies pour stocker et/ou accéder aux informations des appareils. Le fait de consentir à ces technologies nous permettra de traiter des données telles que le comportement de navigation ou les ID uniques sur ce site.</p>

        <h2 style={{ color: 'var(--color-parchment)', marginTop: '24px', marginBottom: '8px' }}>Qu'est-ce qu'un cookie ?</h2>
        <p>Un cookie est un fichier de petite taille, qui ne permet pas l’identification de l’utilisateur, mais qui enregistre des informations relatives à la navigation d’un ordinateur sur un site. Les données ainsi obtenues visent à faciliter la navigation ultérieure sur le site, et ont également vocation à permettre diverses mesures de fréquentation.</p>

        <h2 style={{ color: 'var(--color-parchment)', marginTop: '24px', marginBottom: '8px' }}>Refus d'installation</h2>
        <p>Le refus d’installation d’un cookie peut entraîner l’impossibilité d’accéder à certains services. L’utilisateur peut toutefois configurer son ordinateur pour refuser l’installation des cookies dans les paramètres de son navigateur (Chrome, Firefox, Safari, Edge, etc.).</p>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <Footer />
      </div>
    </main>
  );
}
