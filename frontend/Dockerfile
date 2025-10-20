# Étape 1 : construire l'application React
FROM node:lts-alpine AS build

# Crée un dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste des fichiers du projet React
COPY . .

# Construit l’application (le dossier /build sera créé)
RUN npm run build

# Étape 2 : servir l'application avec un serveur léger
FROM node:lts-alpine

# Installe "serve" pour héberger le build React
RUN npm install -g serve

# Définit le dossier de travail
WORKDIR /app

# Copie le build généré depuis la première étape
COPY --from=build /app/build ./build

# Expose le port 3000 (celui du serveur web)
EXPOSE 3000

# Commande pour lancer le serveur
CMD ["serve", "-s", "build", "-l", "3000"]
