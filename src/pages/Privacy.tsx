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
            <h2 className="text-2xl font-semibold text-white mb-4">5. Traitement des données par l'IA (ChatGPT / OpenAI)</h2>
            <p className="mb-4">
              Certaines fonctionnalités de BrightPath (génération et optimisation de textes) s'appuient sur une API d'intelligence artificielle fournie par un tiers (par exemple ChatGPT / OpenAI). Lorsque vous utilisez ces fonctionnalités, les textes que vous saisissez peuvent être transmis à ce prestataire pour permettre la génération ou l'optimisation du contenu.
            </p>
            <p className="mb-4">
              Les données ainsi envoyées transitent par l'infrastructure de ce prestataire et sont traitées conformément à ses propres conditions d'utilisation et politique de confidentialité, sur lesquelles BrightPath n'a pas de contrôle. En particulier, BrightPath ne peut pas garantir ni gérer la suppression rétroactive, côté prestataire, des informations déjà transmises à cette API.
            </p>
            <p className="mb-4">
              Pour limiter les risques et respecter le RGPD, nous vous recommandons de ne pas inclure de données sensibles ou inutilement identifiantes (par exemple : données de santé, opinions politiques, identifiants administratifs, informations détaillées sur des tiers) dans les textes envoyés à l'IA, et d'anonymiser autant que possible vos contenus.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies et technologies similaires</h2>
            <p className="mb-4">
              Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre site, analyser notre trafic et personnaliser le contenu.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Vos droits (RGPD)</h2>
            <p className="mb-4">
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez, pour les données que nous traitons et contrôlons directement, des droits suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier vos données si elles sont inexactes ou incomplètes</li>
              <li>Demander la suppression de vos données lorsque la loi le permet</li>
              <li>Vous opposer à certains traitements ou en demander la limitation</li>
              <li>Obtenir une copie de vos données dans un format structuré (portabilité)</li>
            </ul>
            <p className="mb-4">
              Pour les données qui ont été envoyées à des prestataires tiers dans le cadre des fonctionnalités d'IA (comme ChatGPT / OpenAI), l'exercice de vos droits (notamment le droit à l'oubli) doit s'effectuer directement auprès de ces prestataires, selon leurs propres procédures. BrightPath ne peut pas, à votre place, forcer la suppression de données déjà traitées au sein de leurs systèmes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Modifications de la politique</h2>
            <p className="mb-4">
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications entrent en vigueur dès leur publication sur le site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Contact</h2>
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