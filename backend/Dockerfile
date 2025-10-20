# Étape 1 : utiliser une image Node.js légère et stable
FROM node:22-alpine3.19

LABEL maintainer="Syrine - DevOps 2025"

# Dossier de travail
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier le reste du projet backend
COPY . .

# Exposer le port de ton serveur Express
EXPOSE 9000

# Variable d'environnement (peut être surchargée par docker-compose)
ENV MONGO_URI=mongodb://mongodb:27017/mern-todolist-db

# Commande de démarrage
CMD ["npm", "start"]
