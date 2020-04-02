# heticiens.news
Ce dépôt git contient le code source de la web app d'HÉTIC Newsroom, `heticiens.news`.

Ce README est destiné aux développeurs et explique le fonctionnement de l'application et les process de développement utilisés.

L'objectif lors de la phase de développement initiale a été de mettre en place une codebase professionnelle avec tout les outils nécessaires pour qu'un éventuel changement d'équipe technique puisse être réalisé facilement, sans nécéssiter une ré-écriture totale de l'app.

De plus, l'accent a été mis sur la capacité à innover et évoluer rapidement.

## Vue d'ensemble
L'application, écrite en React avec le framework **[Next.js](https://nextjs.org/)**, est hébergée sur [AWS](https://aws.amazon.com/). C'est une plateforme très puissante et particulièrement complexe à utiliser (il existe des diplômes de maîtrise AWS), ainsi nous avons mis en place un niveau d'abstraction pour que les développeurs n'aient pas à y toucher directement.

À tout moment il existe deux versions ("environnements") de l'app: `staging` et `production`. Ces versions correspondent aux deux branches principales du git, `staging` et `master`, par un système de *rolling release*: chaque nouveau commit envoyé sur GitHub déclenche automatiquement un déploiement du code source sur l'environnement approprié.

L'environnement staging est accessible à `https://staging.heticiens.news`, production à `https://heticiens.news` (*apex domain*).

Il faut donc développer sur la branche staging, et effectuer un merge sur la branche master quand une nouvelle version est finalisée, afin de la rendre accessible au grand public.
D'ailleurs, la branche master est protégée, donc il faut faire une PR en interne.

Bien entendue les bases de données ne sont pas les mêmes pour les deux environnements, afin de permettre des erreurs sur staging, qui est considéré potentiellement instable.

## Effectuer un commit
Des *commit hooks* sont mis en place (gérés par [husky](https://github.com/typicode/husky)) afin de s'assurer que le code est bien formaté et que la build marche.

Nous utilisons [XO](https://github.com/xojs/xo) comme *code style*, avec des points-virgules `;` et des caractères tab `\t` pour l'indentation.

Les messages de commit sont également validés pour suivre la convention *[Conventional Commits](https://www.conventionalcommits.org/)*. Pour aider à la rédaction de ces messages, un petit outil en ligne de commande est disponible: `npm run commit`.
Les messages de commit sont écrits en anglais.

## Next.js
Si vous n'avez jamais utilisé Next, un tutoriel interactif est disponible [sur leur site](https://nextjs.org/learn/basics/getting-started).

## Infrastructure
***Attention: sujet technique.***

La webapp Next.js est publiée sur AWS avec [Serverless](https://github.com/danielcondemarin/serverless-next.js).

<img src="https://github.com/danielcondemarin/serverless-next.js/raw/master/arch_no_grid.png" alt="Carte infrastructure">

Les assets statiques sont servis depuis un bucket S3 sur `us-east-1` derrière un CDN CloudFront. Les pages dynamiques sont servies depuis Lambda@Edge, aussi géré par CloudFront.

<img src="https://blog.addpipe.com/content/images/2017/12/CS-49_Cloudfront-Map_v3_Palermo-Removed.327ba13fd067b02d2ae7bd4e9c3370e1c14b6c26.png" alt="Carte duplications géographiques">

Les bases de données en revanche ne sont pas dupliquées géographiquements mais hébergés à Paris (`eu-west-3`) en raison du public cible du projet. Une backup automatique sera bientôt mise en place vers des instances à Tokyo (`ap-northeast-1`).