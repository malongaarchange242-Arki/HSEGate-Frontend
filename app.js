
//  CONNEXION 
const formConnexion = document.getElementById('formConnexion');
if (formConnexion) {
    formConnexion.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        localStorage.setItem('employeEmail', email);
        window.location.href = 'dashboard.html';
    });
}

// DÉCONNEXION 
function deconnexion() {
    localStorage.removeItem('employeEmail');
    window.location.href = 'index.html';
}

//  AFFICHER NOM & ZONE SUR DASHBOARD 
window.addEventListener('load', function() {
    const email = localStorage.getItem('employeEmail');
    const nomUtilisateur = document.getElementById('nomUtilisateur');
    const bienvenueNom = document.getElementById('bienvenueNom');
    const zoneUtilisateur = document.getElementById('zoneUtilisateur');
    
    let nomAffiche = 'Monsieur Untel';
    if (email) {
        const partieNom = email.split('@')[0];
        nomAffiche = partieNom.replace('.', ' ');
        nomAffiche = nomAffiche.charAt(0).toUpperCase() + nomAffiche.slice(1);
    }
    
    if (nomUtilisateur) nomUtilisateur.textContent = nomAffiche;
    if (bienvenueNom) bienvenueNom.textContent = nomAffiche;
    if (zoneUtilisateur) zoneUtilisateur.textContent = 'Zone B';
});

//  DÉTERMINER SI C'EST UN INCIDENT — AFFICHER LES CATÉGORIES 
window.addEventListener('load', function() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const sujet = document.getElementById('sujet');
    const titrePage = document.getElementById('titrePage');
    const blocCategories = document.getElementById('blocCategoriesIncident');
    const blocSujetNormal = document.getElementById('blocSujetNormal');
    const dateRapport = document.getElementById('dateRapport');
    const heureRapport = document.getElementById('heureRapport');
    
    // Date et heure du jour par défaut
    if (dateRapport) dateRapport.value = new Date().toISOString().split('T')[0];
    if (heureRapport) heureRapport.value = new Date().toTimeString().slice(0,5);

    // SI C'EST UNE DÉCLARATION D'INCIDENT
    if (type === 'incident' && sujet) {
        titrePage.textContent = "⚠️ Déclaration d'incident / accident";
        sujet.value = 'DÉCLARATION D\'INCIDENT / ACCIDENT';
        sujet.style.backgroundColor = '#FEF2F2';
        sujet.style.borderColor = '#EF4444';
        sujet.readOnly = true; // Empêche la modification du sujet
        if (blocCategories) blocCategories.style.display = 'block'; // Affiche les catégories
        if (blocSujetNormal) blocSujetNormal.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Compte rendu classique — masquer les catégories
        if (blocCategories) blocCategories.style.display = 'none';
        if (sujet) sujet.readOnly = false;
    }
});

//  AFFICHER CHAMP "AUTRE CATÉGORIE" SI CHOISI 
function autreCategorie() {
    const select = document.getElementById('categorieIncident');
    const blocAutre = document.getElementById('blocAutreCategorie');
    if (select && select.value === 'AUTRE') {
        blocAutre.style.display = 'block';
    } else if (blocAutre) {
        blocAutre.style.display = 'none';
    }
}

//  GÉNÉRER LE RAPPORT 
const formRapport = document.getElementById('formRapport');
if (formRapport) {
    formRapport.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Photo jointe
        const inputPhoto = document.getElementById('photoJointe');
        const blocPhoto = document.getElementById('blocPhotoRapport');
        const apercuPhoto = document.getElementById('apercuPhotoRapport');
        
        if (inputPhoto && inputPhoto.files && inputPhoto.files[0]) {
            const lecteur = new FileReader();
            lecteur.onload = function(e) {
                if (apercuPhoto) apercuPhoto.src = e.target.result;
                if (blocPhoto) blocPhoto.style.display = 'block';
            };
            lecteur.readAsDataURL(inputPhoto.files[0]);
        } else {
            if (blocPhoto) blocPhoto.style.display = 'none';
        }
        
        // Récupérer la catégorie (si incident)
        let categorieTexte = '';
        const selectCategorie = document.getElementById('categorieIncident');
        const autreInput = document.getElementById('autreCategorieInput');
        if (selectCategorie && selectCategorie.value) {
            if (selectCategorie.value === 'AUTRE' && autreInput && autreInput.value) {
                categorieTexte = autreInput.value;
            } else if (selectCategorie.value) {
                categorieTexte = selectCategorie.value;
            }
        }
        
        // Remplir les champs du rapport
        const dateRapport = document.getElementById('dateRapport');
        const heureRapport = document.getElementById('heureRapport');
        const zoneRapport = document.getElementById('zoneRapport');
        const sujet = document.getElementById('sujet');
        const description = document.getElementById('description');
        const personnes = document.getElementById('personnes');
        const constat = document.getElementById('constat');
        const actions = document.getElementById('actions');
        const nomDeclarant = document.getElementById('nomDeclarant');
        
        if (document.getElementById('r-date')) document.getElementById('r-date').textContent = dateRapport ? dateRapport.value : '';
        if (document.getElementById('r-heure')) document.getElementById('r-heure').textContent = heureRapport ? heureRapport.value : '';
        if (document.getElementById('r-zone')) document.getElementById('r-zone').textContent = zoneRapport ? zoneRapport.value : '';
        if (document.getElementById('r-sujet')) document.getElementById('r-sujet').textContent = sujet ? sujet.value : '';
        if (document.getElementById('r-description')) document.getElementById('r-description').textContent = description ? description.value : '';
        
        // Catégorie — si présente
        const ligneCategorie = document.getElementById('r-categorie-ligne');
        if (categorieTexte && document.getElementById('r-categorie')) {
            document.getElementById('r-categorie').textContent = categorieTexte;
            if (ligneCategorie) ligneCategorie.style.display = 'block';
        } else if (ligneCategorie) {
            ligneCategorie.style.display = 'none';
        }
        
        // Personnes impliquées — si rempli
        const lignePersonnes = document.getElementById('r-personnes-ligne');
        if (personnes && personnes.value && document.getElementById('r-personnes')) {
            document.getElementById('r-personnes').textContent = personnes.value;
            if (lignePersonnes) lignePersonnes.style.display = 'block';
        } else if (lignePersonnes) {
            lignePersonnes.style.display = 'none';
        }
        
        // Autres champs
        if (document.getElementById('r-constat')) document.getElementById('r-constat').textContent = (constat && constat.value) || 'Aucune observation spécifique.';
        if (document.getElementById('r-actions')) document.getElementById('r-actions').textContent = (actions && actions.value) || 'Aucune action spécifique.';
        if (document.getElementById('r-nom')) document.getElementById('r-nom').textContent = nomDeclarant ? nomDeclarant.value : '';
        
        // Titre du rapport
        const titreRapport = document.getElementById('titreRapportGenere');
        if (sujet && sujet.value.includes('INCIDENT') && titreRapport) {
            titreRapport.textContent = '⚠️ DÉCLARATION D\'INCIDENT — Rapport officiel';
        } else if (titreRapport) {
            titreRapport.textContent = '📄 Compte rendu — Aperçu';
        }
        
        // Afficher le rapport généré
        if (formRapport) formRapport.style.display = 'none';
        const rapportGenere = document.getElementById('rapportGenere');
        if (rapportGenere) rapportGenere.style.display = 'block';
    });
}

//  NOUVEAU RAPPORT l
function nouveauRapport() {
    const formRapport = document.getElementById('formRapport');
    const rapportGenere = document.getElementById('rapportGenere');
    if (formRapport) formRapport.reset();
    if (formRapport) formRapport.style.display = 'block';
    if (rapportGenere) rapportGenere.style.display = 'none';
    // Réinitialiser date et heure
    const dateRapport = document.getElementById('dateRapport');
    const heureRapport = document.getElementById('heureRapport');
    if (dateRapport) dateRapport.value = new Date().toISOString().split('T')[0];
    if (heureRapport) heureRapport.value = new Date().toTimeString().slice(0,5);
    // Revenir au dashboard
    window.location.href = 'dashboard.html';
}

//  RÉINITIALISATION MOT DE PASSE 
const formReinit = document.getElementById('formReinit');
if (formReinit) {
    formReinit.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Les instructions de réinitialisation vous ont été envoyées par e-mail.');
        formReinit.reset();
    });
}