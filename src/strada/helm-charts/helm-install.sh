helm upgrade --install auth-service . \
  --namespace strada --create-namespace \
  --set secrets.databaseUrl="$DATABASE_URL" \
  --set secrets.jwtExpiresIn="$JWT_EXPIRES_IN" \
  --set secrets.publicKeyPath="$PUBLIC_KEY_PATH" \
  --set secrets.privateKeyPath="$PRIVATE_KEY_PATH" \
  --set secrets.googleClientId="$GOOGLE_CLIENT_ID" \
  --set secrets.googleClientSecret="$GOOGLE_CLIENT_SECRET" \
  --set secrets.googleCallbackUrl="$GOOGLE_CALLBACK_URL" \
  --set secrets.githubClientId="$GITHUB_CLIENT_ID" \
  --set secrets.githubClientSecret="$GITHUB_CLIENT_SECRET" \
  --set secrets.githubCallbackUrl="$GITHUB_CALLBACK_URL" \
  --set secrets.awsRegion="$AWS_REGION" \
  --set secrets.awsAccessKeyId="$AWS_ACCESS_KEY_ID" \
  --set secrets.awsSecretAccessKey="$AWS_SECRET_ACCESS_KEY" \
  --set secrets.awsS3Bucket="$AWS_S3_BUCKET" \
  --set secrets.jwtKid="$JWT_KID"


helm upgrade --install ride-service . \
  --namespace strada --create-namespace \
  --set secrets.kafkaBootstrapServers="$KAFKA_BOOTSTRAP_SERVERS" \
  --set secrets.jwkSetUri="$JWKS_URL" \
  --set secrets.corsOrigins="$CORS_ORIGINS" \
  --set secrets.dbHost="$DB_HOST" \
  --set secrets.dbPort="5432"
  --set secrets.dbUser="$DB_USER" \
  --set secrets.dbPassword="$DB_PASSWORD" \
  --set secrets.dbName="$DB_NAME" \
  --set secrets.dbSslMode="$DB_SSLMODE" \
  --set image.tag="0.0.1"


helm upgrade --install chat-service . \
  --namespace strada --create-namespace \
  --set secrets.eurekaServer="$EUREKA_SERVER" \
  --set secrets.kafkaSaslUsername="$KAFKA_SASL_USERNAME" \
  --set secrets.kafkaSaslPassword="$KAFKA_SASL_PASSWORD" \
  --set secrets.kafkaBootstrapServers="$KAFKA_BOOTSTRAP_SERVERS" \
  --set secrets.jwkSetUri="$JWK_SET_URI" \
  --set secrets.corsOrigins="$CORS_ORIGINS" \
  --set secrets.mongoDbUri="$MONGO_DB_URI"

helm upgrade --install notification-service . \
  --namespace strada --create-namespace \
  --set-string secrets.eurekaServer="$EUREKA_SERVER" \
  --set-string secrets.corsOrigins="$CORS_ORIGINS" \
  --set-string secrets.kafkaSaslUsername="$KAFKA_SASL_USERNAME" \
  --set-string secrets.kafkaSaslPassword="$KAFKA_SASL_PASSWORD" \
  --set-string secrets.kafkaBootstrapServers="$KAFKA_BOOTSTRAP_SERVERS" \
  --set-string secrets.dbUrl="$DATABASE_URL" \
  --set-string secrets.jwkSetUri="$JWK_SET_URI" \
  --set image.tag="0.0.3"


export CORS_ORIGINS="*"
export KAFKA_SASL_USERNAME="admin"
export KAFKA_SASL_PASSWORD="admin-secret"
export KAFKA_BOOTSTRAP_SERVERS="kafka-controller-headless.kafka.svc.cluster.local:9092"
export DATABASE_URL="jdbc:postgresql://neondb_owner:npg_8epinYCxcD3A@ep-round-shape-aci7wubl-pooler.sa-east-1.aws.neon.tech/notification-db?sslmode=require"
export JWK_SET_URI="http://auth-service.strada.svc.cluster.local:3000/auth/.well-known/jwks.json"