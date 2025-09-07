# FilmFinder 🎬

## Introduzione

**FilmFinder** è una web application per la gestione e la ricerca di contenuti multimediali su Netflix. Sviluppata per offrire un'esperienza utente completa, la piattaforma consente di esplorare un vasto catalogo di film e serie TV, arricchito da funzionalità di ricerca e personalizzazione avanzate.

---

## Architettura e Tecnologie

Il progetto è costruito su un'architettura a tre livelli che integra diverse tecnologie chiave:

* **Database**: Si utilizza **MongoDB** per l'archiviazione dei dati, gestito tramite il driver **PyMongo**.
* **Backend**: L'applicazione lato server è sviluppata in **Python** utilizzando il framework **Flask**.
* **Frontend**: L'interfaccia utente è realizzata con la libreria **React**, scritta in **JavaScript**.
* **Dataset**: Il catalogo si basa su un dataset disponibile su **Kaggle**, contenente informazioni dettagliate su oltre 5.000 titoli Netflix.

---

## Funzionalità Principali

* **Autenticazione Utente**: Sistema di registrazione e login sicuro.
* **Catalogo e Ricerca Avanzata**: Esplorazione completa del catalogo con filtri e opzioni di ricerca dettagliate.
* **Gestione Preferiti**: Possibilità per gli utenti di creare e gestire una lista personalizzata di titoli preferiti.
* **Dettagli Contenuto**: Pagine dedicate per ogni titolo, con informazioni su cast, registi, valutazioni e metadati.
* **Sistema di Raccomandazione**: Algoritmi di suggerimento che propongono contenuti basati sulle preferenze dell'utente.

---

## Guida all'Installazione e Avvio

Per avviare l'applicazione, seguire i passaggi indicati di seguito.

1.  **Importazione del Dataset**: Importare i file CSV del dataset in MongoDB. I file si trovano nella directory `backend/dataset`. Per istruzioni dettagliate, consultare la [documentazione](https://github.com/grauso-t/FilmFinder/blob/main/docs/doc.pdf).

2.  **Avvio del Backend**:

    ```bash
    cd backend
    python app.py
    ```

3.  **Avvio del Frontend**:

    ```bash
    cd frontend
    npm start
    ```

---

## Screenshot dell'Applicazione

![Pagina di login](https://github.com/grauso-t/FilmFinder/blob/main/docs/login.png)
_Pagina di login_

![Pagina principale](https://github.com/grauso-t/FilmFinder/blob/main/docs/home1.png)
_Homepage con il catalogo dei titoli_

![Dettagli film](https://github.com/grauso-t/FilmFinder/blob/main/docs/film.png)
_Pagina di dettaglio di un film_

![Cast](https://github.com/grauso-t/FilmFinder/blob/main/docs/cast.png)
_Informazioni sul cast di un titolo_

---

## Progetto Accademico

Questo lavoro è stato realizzato nell'ambito del corso di **Basi di Dati II** presso l'**Università degli Studi di Salerno**.
