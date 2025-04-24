const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Get the absolute path to the project root
const projectRoot = path.resolve(__dirname, '..');

// MongoDB connection string
const uri = 'mongodb+srv://dev:123@energeticadb.dzj55.mongodb.net/energetica?retryWrites=true&w=majority';

// Monster product details
const monsterProducts = {
    'celciusdrinkpack': {
        name: 'Celsius Drink Pack',
        description: 'Variety pack of Celsius energy drinks.',
        price: 19.99,
        preDiscountedPrice: 24.99,
        caffeine: 200,
        servingSize: '6x500ml'
    },
    'greenpowder': {
        name: 'Green Energy Powder',
        description: 'Natural energy powder with green tea extract.',
        price: 14.99,
        preDiscountedPrice: 17.99,
        caffeine: 100,
        servingSize: '20 servings'
    },
    'javamonster': {
        name: 'Monster Java',
        description: 'Coffee-flavored Monster Energy drink.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 180,
        servingSize: '500ml'
    },
    'mixtpowdercandy': {
        name: 'Mixt Energy Powder Candy',
        description: 'Sweet candy flavored energy powder.',
        price: 14.99,
        preDiscountedPrice: 17.99,
        caffeine: 100,
        servingSize: '20 servings'
    },
    'mixtpowderlemon': {
        name: 'Mixt Energy Powder Lemon',
        description: 'Lemon flavored energy powder.',
        price: 14.99,
        preDiscountedPrice: 17.99,
        caffeine: 100,
        servingSize: '20 servings'
    },
    'mixtpowderredberry': {
        name: 'Mixt Energy Powder Red Berry',
        description: 'Red berry flavored energy powder.',
        price: 14.99,
        preDiscountedPrice: 17.99,
        caffeine: 100,
        servingSize: '20 servings'
    },
    'mixtpowederblueberry': {
        name: 'Mixt Energy Powder Blueberry',
        description: 'Blueberry flavored energy powder.',
        price: 14.99,
        preDiscountedPrice: 17.99,
        caffeine: 100,
        servingSize: '20 servings'
    },
    'monserassault': {
        name: 'Monster Energy Assault',
        description: 'Military-inspired energy drink with a bold cola flavor.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 160,
        servingSize: '500ml'
    },
    'monsterbadapple': {
        name: 'Monster Energy Bad Apple',
        description: 'Crisp apple flavor with a powerful energy boost.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 160,
        servingSize: '500ml'
    },
    'monsterblack': {
        name: 'Monster Energy Black',
        description: 'Smooth black tea flavor with a powerful energy boost.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 160,
        servingSize: '500ml'
    },
    'monsterblue': {
        name: 'Monster Energy Blue',
        description: 'Blue raspberry flavor with a powerful energy boost.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 160,
        servingSize: '500ml'
    },
    'monsterdrinkpack': {
        name: 'Monster Energy Drink Pack',
        description: 'Variety pack of Monster Energy drinks.',
        price: 19.99,
        preDiscountedPrice: 29.99,
        caffeine: 160,
        servingSize: '6x500ml'
    },
    'monsterm80': {
        name: 'Monster Energy M-80',
        description: 'Explosive fruit punch flavor with a powerful energy boost.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 160,
        servingSize: '500ml'
    },
    'monsterorange': {
        name: 'Monster Energy Orange',
        description: 'Orange flavor with a powerful energy boost.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 160,
        servingSize: '500ml'
    },
    'monsterpack': {
        name: 'Monster Energy Pack',
        description: 'Assorted Monster Energy drinks pack.',
        price: 19.99,
        preDiscountedPrice: 29.99,
        caffeine: 160,
        servingSize: '6x500ml'
    },
    'monsterred': {
        name: 'Monster Energy Red',
        description: 'Red berry flavor with a powerful energy boost.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 160,
        servingSize: '500ml'
    },
    'monsterthedoctor': {
        name: 'Monster Energy The Doctor',
        description: 'Special formula with a unique energy blend.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 160,
        servingSize: '500ml'
    },
    'monsterwhitepack': {
        name: 'Monster Energy White Pack',
        description: 'White Monster Energy drinks pack.',
        price: 19.99,
        preDiscountedPrice: 29.99,
        caffeine: 150,
        servingSize: '6x500ml'
    },
    'mosnterulrablue': {
        name: 'Monster Energy Ultra Blue',
        description: 'Zero sugar blue raspberry flavor with a powerful energy boost.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 150,
        servingSize: '500ml'
    },
    'nutrigopowder': {
        name: 'Nutrigo Energy Powder',
        description: 'Energy powder mix for a quick boost.',
        price: 14.99,
        preDiscountedPrice: 17.99,
        caffeine: 100,
        servingSize: '20 servings'
    },
    'primeredwhiteblue': {
        name: 'Prime Red White Blue',
        description: 'Prime energy drink with patriotic colors.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 200,
        servingSize: '500ml'
    },
    'redbullcrimsonred': {
        name: 'Red Bull Crimson Red',
        description: 'Red Bull with a crimson red twist.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 80,
        servingSize: '250ml'
    },
    'redbullenergy sparkling': {
        name: 'Red Bull Energy Sparkling',
        description: 'Sparkling energy drink with a refreshing taste.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 80,
        servingSize: '250ml'
    },
    'redbullorange': {
        name: 'Red Bull Orange',
        description: 'Orange flavored Red Bull energy drink.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 80,
        servingSize: '250ml'
    },
    'redbullpack': {
        name: 'Red Bull Pack',
        description: 'Assorted Red Bull energy drinks pack.',
        price: 19.99,
        preDiscountedPrice: 29.99,
        caffeine: 80,
        servingSize: '6x250ml'
    },
    'redbullping': {
        name: 'Red Bull Ping',
        description: 'Red Bull with a unique ping flavor.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 80,
        servingSize: '250ml'
    },
    'redbullred': {
        name: 'Red Bull Red',
        description: 'Red flavored Red Bull energy drink.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 80,
        servingSize: '250ml'
    },
    'redbullseablue': {
        name: 'Red Bull Sea Blue',
        description: 'Sea blue flavored Red Bull energy drink.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 80,
        servingSize: '250ml'
    },
    'redbullyellow': {
        name: 'Red Bull Yellow',
        description: 'Yellow flavored Red Bull energy drink.',
        price: 3.99,
        preDiscountedPrice: 4.49,
        caffeine: 80,
        servingSize: '250ml'
    }
};

async function connectToMongoDB() {
    try {
        const client = new MongoClient(uri, {
            serverSelectionTimeoutMS: 60000,
            socketTimeoutMS: 90000,
            connectTimeoutMS: 60000,
            maxPoolSize: 10,
            minPoolSize: 1,
            maxIdleTimeMS: 30000
        });

        await client.connect();
        console.log('Connected to MongoDB successfully');
        return client;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}

async function addMonsterProducts() {
    let client;
    try {
        client = await connectToMongoDB();
        const db = client.db('energetica');
        const productsCollection = db.collection('products');

        const imagesDir = path.join(projectRoot, 'client/images/monster_cans');
        
        if (!fs.existsSync(imagesDir)) {
            console.error(`Images directory not found: ${imagesDir}`);
            process.exit(1);
        }
        
        const files = fs.readdirSync(imagesDir);
        const imageFiles = files.filter(file => 
            file.toLowerCase().endsWith('.jpg') || 
            file.toLowerCase().endsWith('.png')
        );

        console.log(`Found ${imageFiles.length} image files`);

        // Get existing product names
        const existingProducts = new Map();
        try {
            console.log('Fetching existing products...');
            const cursor = productsCollection.find({}, { projection: { name: 1, _id: 1 } });
            const products = await cursor.toArray();
            products.forEach(product => existingProducts.set(product.name, product._id));
            console.log(`Found ${existingProducts.size} existing products`);
        } catch (error) {
            console.error('Error fetching existing products:', error.message);
            console.log('Continuing with empty set of existing products');
        }

        // Prepare update operations
        const updateOps = [];
        for (const imageFile of imageFiles) {
            const imageName = path.parse(imageFile).name.toLowerCase();
            const productKey = imageName.replace(/[^a-z0-9_]/g, '_');
            
            if (monsterProducts[productKey]) {
                const productData = monsterProducts[productKey];
                const productId = existingProducts.get(productData.name);
                
                if (productId) {
                    updateOps.push({
                        updateOne: {
                            filter: { _id: productId },
                            update: {
                                $set: {
                                    preDiscountedPrice: productData.preDiscountedPrice,
                                    price: productData.price,
                                    description: productData.description,
                                    caffeine: productData.caffeine,
                                    servingSize: productData.servingSize,
                                    imageUrl: `/images/monster_cans/${imageFile}`,
                                    updatedAt: new Date()
                                }
                            }
                        }
                    });
                    console.log(`Updating product: ${productData.name}`);
                } else {
                    // If product doesn't exist, add it
                    updateOps.push({
                        insertOne: {
                            document: {
                                name: productData.name,
                                description: productData.description,
                                price: productData.price,
                                preDiscountedPrice: productData.preDiscountedPrice,
                                category: 'drink',
                                imageUrl: `/images/monster_cans/${imageFile}`,
                                caffeine: productData.caffeine,
                                servingSize: productData.servingSize,
                                inStock: true,
                                createdAt: new Date()
                            }
                        }
                    });
                    console.log(`Adding new product: ${productData.name}`);
                }
            }
        }

        // Execute update operations if any
        if (updateOps.length > 0) {
            console.log(`Preparing to update ${updateOps.length} products`);
            try {
                const result = await productsCollection.bulkWrite(updateOps, { ordered: false });
                console.log(`Successfully updated ${result.modifiedCount} products`);
                console.log(`Successfully inserted ${result.insertedCount} new products`);
            } catch (error) {
                console.error('Error in bulk update:', error.message);
                if (error.writeErrors) {
                    console.error('Write errors:', error.writeErrors);
                }
            }
        } else {
            console.log('No products to update');
        }

    } catch (error) {
        console.error('Error in addMonsterProducts:', error.message);
    } finally {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed');
        }
    }
}

// Main execution
async function main() {
    try {
        await addMonsterProducts();
    } catch (error) {
        console.error('Fatal error:', error.message);
        process.exit(1);
    }
}

// Run the main function
main(); 