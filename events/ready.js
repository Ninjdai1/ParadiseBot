module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        console.log("Prêt !");
        client.user.setStatus('online');
    }
}