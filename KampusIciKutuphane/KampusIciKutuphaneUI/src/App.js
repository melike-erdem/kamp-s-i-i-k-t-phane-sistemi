import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './scss/style.scss';

import KimlikKontrolu from './KimlikKontrolu';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const OturumAc = React.lazy(() => import('./views/kimlik/OturumAc'));
const KayitOl = React.lazy(() => import('./views/kimlik/KayitOl'));

class App extends Component {

  render() {
    return (
      <HashRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path="/oturumac" name="Oturum Aç" render={props => <OturumAc {...props}/>} />
              <Route exact path="/kayitol" name="Kayıt Ol" render={props => <KayitOl {...props}/>} />
              <Route path="/" name="Kimlik Kontrolü" component={KimlikKontrolu(TheLayout)} />
            </Switch>
          </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
