import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Simulation d'une connexion réussie (à remplacer par l'appel API)
        // TODO: Remplacer par l'appel API réel
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockUser = {
          id: '1',
          email: email,
          name: email.split('@')[0] // Utilise la partie avant @ comme nom
        };
        
        login(mockToken, mockUser);
        navigate('/');
      } else {
        // Simulation d'une inscription réussie
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setIsLogin(true);
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Éléments visuels d'arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-transparent opacity-30"></div>
      
      {/* Cercles décoratifs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      {/* Grille décorative */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMzYTM5M2YiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTE1IDE1aDMwdjMwSDE1eiIgZmlsbD0iIzBjMDkwYyIgZmlsbC1vcGFjaXR5PSIuNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h1>
          <p className="mt-2 text-gray-300">
            {isLogin 
              ? 'Accédez à votre espace personnel BrightPath' 
              : 'Rejoignez BrightPath pour optimiser votre recherche d\'emploi'}
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-cyan-500 rounded border-gray-600 bg-gray-700 focus:ring-cyan-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Se souvenir de moi
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/reset-password" className="text-cyan-400 hover:text-cyan-300">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
            )}
            
            {!isLogin && (
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirmez le mot de passe
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'Connexion...' : 'Inscription...'}
                  </div>
                ) : (
                  isLogin ? 'Se connecter' : 'S\'inscrire'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
            >
              {isLogin ? 'Créer un compte' : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            En vous connectant, vous acceptez nos <Link to="/terms" className="text-cyan-400 hover:text-cyan-300">conditions d'utilisation</Link> et notre <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300">politique de confidentialité</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login; 