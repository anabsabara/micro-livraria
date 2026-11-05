const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Carrega arquivo .proto
const reviewsProtoDefinition = protoLoader.loadSync('proto/review.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const reviewsPackageDefinition = grpc.loadPackageDefinition(reviewsProtoDefinition);

// Avaliações armazenadas em memória
const reviewsData = [];
const server = new grpc.Server();

server.addService(reviewsPackageDefinition.ReviewService.service, {
    // Retorna todas as avaliações de um produto
    GetReviews: (call, callback) => {
        const productId = call.request.id;
        const productReviews = reviewsData.filter((review) => review.productId == productId);
        callback(null, { reviews: productReviews });
    },

    // Adiciona uma nova avaliação
    AddReview: (call, callback) => {
        const review = call.request;
        review.date = new Date().toISOString();
        reviewsData.push(review);
        callback(null, {
            success: true,
            message: 'Avaliação adicionada com sucesso!',
        });
    },
});

server.bindAsync('0.0.0.0:3003', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log('Reviews Service running at http://127.0.0.1:3003');
});
