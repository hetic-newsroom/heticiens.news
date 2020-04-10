# Émulation locale des bases de données

Tout ce qui est dans ce dossier sert à reproduire *localement* (= sur ton ordinateur) une base de données qui est structurellement similaire aux environnements *staging* et *production* sur le cloud, pour pouvoir tester des fonctionnalités du site qui ont besoin d'accéder à ces données (par exemple, les inscriptions à la newsletter, l'espace réservé aux contributeurs, et).

Les instructions pour installer l'émulateur DynamoDB sont sont sur le site d'AWS (in english ofc): https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html

Une fois cela fait, il faut lancer le serveur DDB, et exécuter les scripts node présent dans ce dossier pour remplir les tables de données factices.
