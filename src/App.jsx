import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

// 1. REPLACE WITH YOUR REAL FIREBASE CONFIG FROM CONSOLE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  // Listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace('Firebase:', ''));
    }
  };

  if (loading) return <div className="loading">Loading Hub...</div>;

  return (
    <>
      <style>{`
        /* --- YOUR PROFESSIONAL CSS --- */
        :root {
          --bg: #f4f6fb; --blue: #2563eb; --text: #0f172a;
          --sh-lg: 0 12px 40px rgba(15,23,42,.13); --r2: 12px;
        }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); margin: 0; }
        
        .auth-container { 
          display: flex; align-items: center; justify-content: center; 
          min-height: 100vh; padding: 20px;
        }
        .auth-card {
          background: white; padding: 40px; border-radius: var(--r2);
          box-shadow: var(--sh-lg); max-width: 400px; width: 100%;
        }
        .auth-card h2 { font-family: 'Lora', serif; margin-bottom: 10px; color: var(--text); }
        .fld { margin-bottom: 15px; }
        .fld label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 5px; }
        .fld input { 
          width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e2e5ef;
          box-sizing: border-box; font-family: inherit;
        }
        .btn-main {
          width: 100%; padding: 12px; background: var(--blue); color: white;
          border: none; border-radius: 8px; font-weight: 700; cursor: pointer;
        }
        .error-msg { color: #dc2626; font-size: 12px; margin-bottom: 10px; }
        .switch-text { text-align: center; font-size: 13px; margin-top: 20px; color: #64748b; }
        .switch-text span { color: var(--blue); cursor: pointer; font-weight: 600; }

        .dashboard { padding: 40px; text-align: center; }
        .nav-simple { 
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px 40px; background: white; border-bottom: 1px solid #e2e5ef;
        }
      `}</style>

      {!user ? (
        /* --- AUTH PAGE --- */
        <div className="auth-container">
          <div className="auth-card">
            <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>
            <p style={{color: '#64748b', fontSize: '14px', marginBottom: '25px'}}>
              {isSignUp ? "Start your IELTS journey today" : "Sign in to continue practicing"}
            </p>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleAuth}>
              <div className="fld">
                <label>Email Address</label>
                <input type="email" placeholder="name@company.com" required 
                  onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="fld">
                <label>Password</label>
                <input type="password" placeholder="••••••••" required 
                  onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn-main">
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>

            <div className="switch-text">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <span onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Sign In" : "Create one for free"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* --- MAIN DASHBOARD (Where your tests live) --- */
        <div className="main-app">
          <nav className="nav-simple">
            <div style={{fontWeight: 700, color: 'var(--blue)'}}>🎧 IELTS PRO</div>
            <div>
              <span style={{marginRight: '15px', fontSize: '14px'}}>{user.email}</span>
              <button onClick={() => signOut(auth)} 
                style={{padding: '5px 12px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ccc'}}>
                Sign Out
              </button>
            </div>
          </nav>

          <div className="dashboard">
            <h1 style={{fontFamily: 'Lora, serif'}}>IELTS Listening Practice Hub</h1>
            <p>100 Full-Length Tests unlocked for <strong>{user.email}</strong></p>
            <div style={{marginTop: '40px', color: '#94a3b8'}}>
              (Test List Component will go here next!)
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
