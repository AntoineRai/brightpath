import React from 'react';

function Terms() {
  return (
    <div className="h-[calc(100vh-64px)] bg-gray-900 overflow-y-auto">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 text-gray-300">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8">Conditions d'utilisation</h1>
        
        <div className="space-y-8 bg-gray-800/50 p-8 rounded-lg shadow-xl">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptation des conditions</h2>
            <p className="mb-4">
              En accédant et en utilisant BrightPath, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Description du service</h2>
            <p className="mb-4">
              BrightPath est une plateforme de gestion de candidatures qui permet aux utilisateurs de suivre leurs candidatures, de générer des CV et des lettres de motivation, et d'optimiser leur recherche d'emploi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Compte utilisateur</h2>
            <p className="mb-4">
              Pour utiliser certaines fonctionnalités de BrightPath, vous devez créer un compte. Vous êtes responsable du maintien de la confidentialité de vos informations de connexion et de toutes les activités qui se produisent sous votre compte.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Utilisation du service</h2>
            <p className="mb-4">
              Vous acceptez d'utiliser le service conformément à toutes les lois applicables. Vous ne devez pas :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utiliser le service à des fins illégales</li>
              <li>Transmettre des virus ou autres codes malveillants</li>
              <li>Tenter d'accéder sans autorisation à des parties du service</li>
              <li>Interférer avec le fonctionnement normal du service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Propriété intellectuelle</h2>
            <p className="mb-4">
              Tout le contenu présent sur BrightPath, incluant mais non limité aux textes, graphiques, logos, et code source, est la propriété de BrightPath ou de ses concédants de licence et est protégé par les lois sur la propriété intellectuelle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Modifications des conditions</h2>
            <p className="mb-4">
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur le site. Votre utilisation continue du service après toute modification constitue votre acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Contact</h2>
            <p className="mb-4">
              Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à support@brightpath.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Terms; 