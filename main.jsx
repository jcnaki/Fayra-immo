
import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Home, Users, Bell, FileText, Plus, CheckCircle2, Phone, Mail, ClipboardList } from 'lucide-react';
import './style.css';

const initialClients = [
  { id: 1, type: 'Acquéreur', name: 'M. Aubry', need: 'Garage / secteur Biscarrosse Plage', priority: 'Chaud', nextAction: 'Relancer avec proposition adaptée' },
  { id: 2, type: 'Vendeur', name: 'Mme Vincendeau', need: 'Signature / suivi notaire', priority: 'Urgent', nextAction: 'Vérifier avancement compromis' },
  { id: 3, type: 'Acquéreur', name: 'Client Domaine du Golf', need: 'Maison 3 chambres / budget 600 k€', priority: 'Chaud', nextAction: 'Envoyer bien correspondant' },
];

const properties = [
  { id: 1, title: 'Appartement Biscarrosse Plage', price: '230 000 € net vendeur', status: 'Mandat à éditer', missing: 'Diagnostics + titre de propriété' },
  { id: 2, title: 'Maison Domaine du Golf', price: '600 000 € FAI', status: 'À proposer', missing: 'Validation vendeur' },
  { id: 3, title: 'Bien résidence Les Plages', price: '265 200 € FAI', status: 'Attente SSP', missing: 'Feu vert commercialisation' },
];

function Button({ children, onClick, variant = 'default', small = false }) {
  return <button onClick={onClick} className={`btn ${variant} ${small ? 'small' : ''}`}>{children}</button>;
}

function App() {
  const [tab, setTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState(initialClients);
  const [newClient, setNewClient] = useState('');

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      `${client.name} ${client.type} ${client.need} ${client.priority}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [clients, search]);

  const addClient = () => {
    if (!newClient.trim()) return;
    setClients([
      { id: Date.now(), type: 'Contact', name: newClient, need: 'À qualifier', priority: 'Nouveau', nextAction: 'Appeler et compléter la fiche' },
      ...clients,
    ]);
    setNewClient('');
  };

  const smsTemplate = "Bonjour, je reviens vers vous concernant votre projet immobilier. J’ai une information intéressante à vous transmettre. Pouvez-vous me rappeler quand vous êtes disponible ? Jean-Claude, Cabinet Bedin Biscarrosse Plage.";
  const mailTemplate = "Bonjour, comme convenu, je vous transmets les éléments relatifs à votre projet immobilier. Je reste à votre disposition pour échanger et avancer efficacement sur le dossier. Bien cordialement, Jean-Claude Navail, Cabinet Bedin Immobilier Biscarrosse Plage.";

  return (
    <div className="app">
      <header>
        <div className="topbar">
          <div>
            <h1>Fayra Immo</h1>
            <p>CRM mobile — action commerciale</p>
          </div>
          <Button small onClick={() => setTab('clients')}><Plus size={16}/> Contact</Button>
        </div>
        <div className="search">
          <Search size={16}/>
          <input placeholder="Rechercher client, bien, action..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </header>

      <main>
        {tab === 'dashboard' && <>
          <div className="stats">
            <Stat title="Relances jour" value="9" />
            <Stat title="Clients chauds" value="27" />
            <Stat title="Mandats actifs" value="18" />
            <Stat title="Offres en cours" value="4" />
          </div>
          <section className="card">
            <h2>Priorités du jour</h2>
            {clients.slice(0, 3).map((client) => (
              <div key={client.id} className="task">
                <CheckCircle2 size={20}/>
                <div>
                  <strong>{client.nextAction}</strong>
                  <span>{client.name} · {client.priority}</span>
                </div>
              </div>
            ))}
          </section>
        </>}

        {tab === 'clients' && <section className="card">
          <h2>Clients</h2>
          <div className="addrow">
            <input placeholder="Nom du contact" value={newClient} onChange={(e) => setNewClient(e.target.value)} />
            <Button onClick={addClient}>Ajouter</Button>
          </div>
          {filteredClients.map((client) => (
            <div key={client.id} className="client">
              <div className="clienttop"><strong>{client.name}</strong><span>{client.priority}</span></div>
              <small>{client.type}</small>
              <p>{client.need}</p>
              <em>Action : {client.nextAction}</em>
              <div className="actions">
                <Button small variant="outline"><Phone size={15}/> Appeler</Button>
                <Button small variant="outline"><Mail size={15}/> SMS</Button>
              </div>
            </div>
          ))}
        </section>}

        {tab === 'biens' && <section className="card">
          <h2>Biens suivis</h2>
          {properties.map((property) => (
            <div key={property.id} className="client">
              <strong>{property.title}</strong>
              <p>{property.price}</p>
              <small>Statut : {property.status}</small>
              <em className="red">Manquant : {property.missing}</em>
            </div>
          ))}
        </section>}

        {tab === 'relances' && <section className="card">
          <h2>Relances prioritaires</h2>
          {clients.map((client) => <div key={client.id} className="task"><Bell size={18}/><div><strong>{client.name}</strong><span>{client.nextAction}</span></div></div>)}
        </section>}

        {tab === 'messages' && <section className="card">
          <h2>Générateur rapide</h2>
          <Template title="SMS relance client" text={smsTemplate} />
          <Template title="Mail professionnel" text={mailTemplate} />
        </section>}
      </main>

      <nav>
        <NavButton active={tab === 'dashboard'} icon={<Home/>} label="Accueil" onClick={() => setTab('dashboard')} />
        <NavButton active={tab === 'clients'} icon={<Users/>} label="Clients" onClick={() => setTab('clients')} />
        <NavButton active={tab === 'biens'} icon={<FileText/>} label="Biens" onClick={() => setTab('biens')} />
        <NavButton active={tab === 'relances'} icon={<Bell/>} label="Relances" onClick={() => setTab('relances')} />
        <NavButton active={tab === 'messages'} icon={<ClipboardList/>} label="Textes" onClick={() => setTab('messages')} />
      </nav>
    </div>
  );
}

function Stat({ title, value }) {
  return <div className="stat"><span>{title}</span><strong>{value}</strong></div>;
}

function NavButton({ active, icon, label, onClick }) {
  return <button onClick={onClick} className={`navbtn ${active ? 'active' : ''}`}>{React.cloneElement(icon, { size: 18 })}<span>{label}</span></button>;
}

function Template({ title, text }) {
  return <div className="client"><strong>{title}</strong><p>{text}</p><Button small variant="outline" onClick={() => navigator.clipboard?.writeText(text)}>Copier</Button></div>;
}

createRoot(document.getElementById('root')).render(<App />);
