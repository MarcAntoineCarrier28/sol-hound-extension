import './App.css';

function App() {

  return (
    <>
      <div className="header">
        <div className="logo-container">
            <img src="/icon/48.png" alt="Solhound Logo" className="logo"/>
            <span className="title">Solhound</span>
        </div>
        <button className="support-btn" id="supportButton">
            <img src="/icon/support.png" alt="Support"/>
        </button>
    </div>

    <div className="section">
        <div className="feature">
            <span>Highlight CA's</span>
            <label className="switch">
                <input type="checkbox" id="toggleHighlight" aria-label="Toggle Highlight Contract Addresses"/>
                <span className="slider round"></span>
            </label>
        </div>
    </div>

    <div className="section premium-section">
        <div className="premium-title">Unlock with Premium</div>

        <div className="feature locked">
            <div className="feature-text">
                <span className="lock-icon">🔒</span>
                <span>One-click trading</span>
            </div>
            <label className="switch">
                <input type="checkbox" disabled aria-label="One-click trading toggle"/>
                <span className="slider round"></span>
            </label>
        </div>

        <div className="feature locked">
            <div className="feature-text">
                <span className="lock-icon">🔒</span>
                <span>Customization</span>
            </div>
            <label className="switch">
                <input type="checkbox" disabled aria-label="Customization toggle"/>
                <span className="slider round"></span>
            </label>
        </div>

        <div className="feature locked">
            <div className="feature-text">
                <span className="lock-icon">🔒</span>
                <span>Analytics</span>
            </div>
            <label className="switch">
                <input type="checkbox" disabled aria-label="Analytics toggle"/>
                <span className="slider round"></span>
            </label>
        </div>
    </div>

    <button id="upgrade" className="btn-primary">Go Premium</button>
    </>
  );
}

export default App;
