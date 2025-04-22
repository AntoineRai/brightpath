import React from 'react';

function Privacy() {
  return (
    <div className="h-[calc(100vh-64px)] bg-gray-900 overflow-y-auto">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 text-gray-300">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8">Politique de confidentialité</h1>
        
        <div className="space-y-8 bg-gray-800/50 p-8 rounded-lg shadow-xl">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Collecte des informations</h2>
            <p className="mb-4">
              Nous collectons les informations que vous nous fournissez directement lorsque vous :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Créez un compte</li>
              <li>Complétez votre profil</li>
              <li>Soumettez des candidatures</li>
              <li>Contactez notre support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Utilisation des informations</h2>
            <p className="mb-4">
              Nous utilisons les informations collectées pour :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personnaliser votre expérience</li>
              <li>Améliorer notre service</li>
              <li>Communiquer avec vous</li>
              <li>Assurer la sécurité de votre compte</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Protection des données</h2>
            <p className="mb-4">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Partage des informations</h2>
            <p className="mb-4">
              Nous ne vendons, n'échangeons ni ne transférons vos informations personnelles à des tiers sans votre consentement, sauf lorsque cela est nécessaire pour fournir nos services ou lorsque la loi l'exige.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Cookies et technologies similaires</h2>
            <p className="mb-4">
              Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre site, analyser notre trafic et personnaliser le contenu.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Vos droits</h2>
            <p className="mb-4">
              Vous avez le droit de :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier vos données</li>
              <li>Supprimer vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Exporter vos données</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Modifications de la politique</h2>
            <p className="mb-4">
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications entrent en vigueur dès leur publication sur le site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Contact</h2>
            <p className="mb-4">
              Pour toute question concernant notre politique de confidentialité, veuillez nous contacter à privacy@brightpath.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Privacy; 