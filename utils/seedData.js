import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

dotenv.config();

// Link Database của bạn

const recipesData = [
    // =================================================================
    // 1. VIETNAMESE CUISINE
    // =================================================================
    {
        title: 'Traditional Beef Pho',
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Vietnamese', mealType: 'Breakfast', difficulty: 'Hard', time: 180, rating: 4.9,
        ingredients: ['rice noodles', 'beef', 'onion', 'ginger', 'star anise', 'cinnamon', 'fish sauce', 'spring onion'],
        steps: [
            'Clean the beef bones: Parboil the bones in a large pot of boiling water for 10 minutes to remove impurities. Drain and rinse thoroughly under cold water.',
            'Prepare aromatics: Char the onion and ginger over an open flame or in a dry pan until blackened and fragrant. Peel off the charred skin and rinse.',
            'Simmer the broth: Place bones, charred onion, ginger, star anise, and cinnamon in a large pot. Fill with water and simmer on low heat for at least 3 hours. Skim off foam frequently.',
            'Seasoning: Season the broth with high-quality fish sauce, a pinch of rock sugar, and salt. Adjust to taste. Strain the broth through a fine mesh sieve.',
            'Assembly: Blanch the rice noodles in boiling water and place them in a bowl. Top with thinly sliced raw beef, chopped spring onions, and cilantro.',
            'Serve: Pour the boiling hot broth directly over the raw beef to cook it instantly. Serve immediately with lime wedges, chili, and fresh herbs.'
        ],
        nutrition: { calories: 450, protein: 25, fat: 12, carbs: 55 },
        tags: ['Soup', 'Traditional'], isGlutenFree: true
    },
    {
        title: 'Banh Mi Grilled Pork',
        image: 'https://images.unsplash.com/photo-1635586634892-e42d765b9347?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Vietnamese', mealType: 'Lunch', difficulty: 'Medium', time: 30, rating: 4.8,
        ingredients: ['bread', 'pork', 'cucumber', 'carrot', 'cilantro', 'mayonnaise', 'soy sauce', 'lemongrass'],
        steps: [
            'Marinate the pork: Thinly slice the pork shoulder and marinate with minced lemongrass, garlic, soy sauce, honey, and a dash of pepper for at least 20 minutes.',
            'Pickle veggies: Julienne the carrots and radish. Toss them in a mixture of vinegar, sugar, and salt. Let sit for 15 minutes then drain.',
            'Grill the meat: Grill the pork slices over charcoal or pan-sear on high heat until caramelized, golden brown, and cooked through.',
            'Prepare the bread: Toast the baguette in the oven until the crust is crispy and the inside is warm. Slice horizontally.',
            'Assemble: Spread mayonnaise and pate inside the bread. Layer with cucumber strips, grilled pork, pickled carrots, fresh cilantro, and chili slices.',
            'Finish: Drizzle with a few drops of soy sauce or Maggi seasoning for extra flavor.'
        ],
        nutrition: { calories: 550, protein: 20, fat: 25, carbs: 60 },
        tags: ['Sandwich', 'Street Food']
    },
    {
        title: 'Fresh Summer Rolls',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Vietnamese', mealType: 'Snack', difficulty: 'Medium', time: 40, rating: 4.7,
        ingredients: ['shrimp', 'pork', 'rice noodles', 'lettuce', 'cucumber', 'hoisin sauce', 'peanuts'],
        steps: [
            'Cook proteins: Boil the pork belly until tender, then slice thinly. Boil the shrimp, peel, and slice in half lengthwise.',
            'Prepare noodles: Cook the rice vermicelli noodles according to package instructions, rinse with cold water, and drain well.',
            'Soften rice paper: Dip a sheet of rice paper into warm water for about 2 seconds, then lay it flat on a plate.',
            'Layer ingredients: Place lettuce, herbs, and vermicelli on the bottom third of the paper. Place pork and shrimp in the center.',
            'Roll: Fold the sides of the rice paper inward, then roll tightly from the bottom up, keeping the filling secure.',
            'Serve: Serve with a dipping sauce made from hoisin sauce, peanut butter, and crushed roasted peanuts.'
        ],
        nutrition: { calories: 300, protein: 15, fat: 5, carbs: 40 },
        tags: ['Healthy', 'Fresh']
    },
    {
        title: 'Bun Cha Hanoi',
        image: 'https://images.unsplash.com/photo-1595304958123-c97779919456?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Vietnamese', mealType: 'Lunch', difficulty: 'Medium', time: 60, rating: 4.9,
        ingredients: ['pork', 'rice noodles', 'fish sauce', 'sugar', 'garlic', 'carrot', 'papaya'],
        steps: [
            'Marinate meat: Mix ground pork with minced shallots, fish sauce, sugar, and pepper. Form into small patties. Slice pork belly thinly and marinate similarly.',
            'Grill: Grill the pork patties and pork belly over charcoal until charred and smoky. This is key to the flavor.',
            'Make dipping sauce: Combine fish sauce, sugar, vinegar, and warm water (1:1:1:5 ratio). Add minced garlic, chili, and slices of green papaya/carrot.',
            'Assemble: Place the grilled meat directly into the warm dipping sauce bowl.',
            'Serve: Serve the bowl of meat alongside a plate of cold rice vermicelli noodles and a basket of fresh herbs (lettuce, perilla, mint).'
        ],
        nutrition: { calories: 600, protein: 30, fat: 25, carbs: 60 },
        tags: ['Grilled', 'Noodle']
    },
    {
        title: 'Vietnamese Beef Stew (Bo Kho)',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Vietnamese', mealType: 'Dinner', difficulty: 'Hard', time: 120, rating: 4.7,
        ingredients: ['beef', 'carrot', 'lemongrass', 'star anise', 'bread', 'coconut milk'],
        steps: [
            'Marinate beef: Cut beef shank or brisket into cubes. Marinate with five-spice powder, sugar, fish sauce, minced ginger, and garlic for 30 minutes.',
            'Sear: Heat oil in a pot, sauté lemongrass stalks and star anise. Add beef and sear until browned on all sides.',
            'Stew: Pour in coconut water (or water) to cover the meat. Simmer on low heat for about 1.5 hours until the beef is tender.',
            'Add vegetables: Add carrot chunks and cook for another 20 minutes until soft.',
            'Thicken (Optional): Stir in a little cornstarch slurry if you prefer a thicker sauce. Garnish with basil and serve with a warm baguette.'
        ],
        nutrition: { calories: 550, protein: 30, fat: 25, carbs: 45 },
        tags: ['Stew', 'Comfort Food']
    },

    // =================================================================
    // 2. ITALIAN CUISINE
    // =================================================================
    {
        title: 'Spaghetti Carbonara',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Italian', mealType: 'Dinner', difficulty: 'Medium', time: 25, rating: 4.8,
        ingredients: ['spaghetti', 'bacon', 'eggs', 'parmesan', 'black pepper'],
        steps: [
            'Cook pasta: Boil spaghetti in salted water until al dente. Reserve 1/2 cup of pasta water before draining.',
            'Crisp the meat: Fry bacon (or guanciale) in a pan until crispy. Remove from heat but keep the fat in the pan.',
            'Prepare sauce: In a bowl, whisk eggs, grated Parmesan cheese, and plenty of black pepper until smooth.',
            'Combine: Add the hot pasta directly to the pan with bacon fat. Toss to coat.',
            'Create emulsion: Remove pan from heat completely (crucial!). Pour in the egg mixture while stirring vigorously to create a creamy sauce without scrambling the eggs.',
            'Serve: If the sauce is too thick, add a splash of reserved pasta water. Serve immediately with extra cheese.'
        ],
        nutrition: { calories: 600, protein: 25, fat: 30, carbs: 55 },
        tags: ['Pasta', 'Creamy']
    },
    {
        title: 'Classic Margherita Pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Italian', mealType: 'Dinner', difficulty: 'Medium', time: 60, rating: 4.7,
        ingredients: ['flour', 'tomato', 'mozzarella', 'basil', 'olive oil'],
        steps: [
            'Prepare dough: Mix flour, yeast, salt, and warm water. Knead for 10 minutes until smooth. Let rise for 1 hour until doubled in size.',
            'Preheat: Preheat your oven to the highest possible setting (450°F+). If using a pizza stone, heat it up.',
            'Shape pizza: Stretch the dough into a thin circle by hand. Place on a baking sheet or peel.',
            'Toppings: Spread a thin layer of crushed San Marzano tomatoes. Top with fresh mozzarella slices and a drizzle of olive oil.',
            'Bake: Bake for 8-10 minutes until the crust is blistered and cheese is bubbly.',
            'Garnish: Remove from oven and immediately top with fresh basil leaves.'
        ],
        nutrition: { calories: 800, protein: 30, fat: 25, carbs: 90 },
        tags: ['Pizza', 'Vegetarian'], isVegetarian: true
    },
    {
        title: 'Beef Lasagna',
        image: 'https://images.unsplash.com/photo-1574868235275-f09b581b0460?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Italian', mealType: 'Dinner', difficulty: 'Hard', time: 90, rating: 4.9,
        ingredients: ['beef', 'tomato', 'flour', 'milk', 'mozzarella', 'parmesan', 'pasta'],
        steps: [
            'Meat Sauce: Sauté onions and ground beef until browned. Add tomato sauce and herbs. Simmer for 20 minutes.',
            'Bechamel Sauce: Melt butter, stir in flour, then whisk in milk slowly. Cook until thickened. Stir in nutmeg and parmesan.',
            'Assembly: In a baking dish, spread a little meat sauce. Layer: Pasta Sheet -> Meat Sauce -> Bechamel -> Mozzarella.',
            'Repeat: Repeat layers 3-4 times, finishing with a generous layer of mozzarella and parmesan on top.',
            'Bake: Cover with foil and bake at 375°F for 25 minutes. Remove foil and bake 10 more minutes until golden and bubbly.'
        ],
        nutrition: { calories: 850, protein: 40, fat: 45, carbs: 60 },
        tags: ['Baked', 'Cheesy']
    },
    {
        title: 'Mushroom Risotto',
        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Italian', mealType: 'Dinner', difficulty: 'Hard', time: 45, rating: 4.6,
        ingredients: ['rice', 'mushroom', 'butter', 'onion', 'parmesan', 'olive oil'],
        steps: [
            'Prep: Keep vegetable broth simmering in a separate pot. Sauté sliced mushrooms in butter until browned, then set aside.',
            'Toast rice: In the same pan, sauté onions until soft. Add Arborio rice and toast for 2 minutes.',
            'Cook: Add warm broth one ladle at a time, stirring constantly. Wait until liquid is absorbed before adding more. Repeat for 20 mins.',
            'Finish: When rice is tender but firm to the bite, remove from heat. Stir in cold butter, parmesan cheese, and the cooked mushrooms.',
            'Serve: Serve immediately while creamy.'
        ],
        nutrition: { calories: 500, protein: 12, fat: 20, carbs: 65 },
        tags: ['Rice', 'Creamy'], isVegetarian: true
    },
    {
        title: 'Caprese Salad',
        image: 'https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Italian', mealType: 'Snack', difficulty: 'Easy', time: 10, rating: 4.5,
        ingredients: ['tomato', 'mozzarella', 'basil', 'olive oil', 'balsamic vinegar'],
        steps: [
            'Slice: Slice ripe tomatoes and fresh mozzarella ball into 1/4 inch thick rounds.',
            'Arrange: On a large platter, arrange tomato and mozzarella slices in an alternating pattern.',
            'Garnish: Tuck fresh basil leaves between the cheese and tomato slices.',
            'Dress: Drizzle generously with extra virgin olive oil and a balsamic glaze reduction.',
            'Season: Sprinkle with flaky sea salt and freshly ground black pepper just before serving.'
        ],
        nutrition: { calories: 250, protein: 12, fat: 20, carbs: 5 },
        tags: ['Salad', 'Healthy'], isVegetarian: true
    },

    // =================================================================
    // 3. AMERICAN CUISINE
    // =================================================================
    {
        title: 'Classic Cheeseburger',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        cuisine: 'American', mealType: 'Dinner', difficulty: 'Easy', time: 20, rating: 4.7,
        ingredients: ['beef', 'bread', 'cheddar cheese', 'lettuce', 'tomato', 'ketchup'],
        steps: [
            'Form patties: Divide ground beef into portions and gently form into patties slightly larger than your buns. Season generously with salt and pepper.',
            'Cook: Grill or pan-fry patties on high heat for 3-4 minutes per side until a crust forms.',
            'Melt cheese: In the last minute of cooking, place a slice of cheddar on each patty and cover the pan to melt the cheese.',
            'Toast buns: Butter the cut sides of the buns and toast them until golden.',
            'Assemble: Spread sauce on the bun. Layer lettuce, tomato, onion, the patty, and top bun. Serve with fries.'
        ],
        nutrition: { calories: 700, protein: 35, fat: 40, carbs: 50 },
        tags: ['Burger', 'Fast Food']
    },
    {
        title: 'Crispy Fried Chicken',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
        cuisine: 'American', mealType: 'Dinner', difficulty: 'Medium', time: 45, rating: 4.8,
        ingredients: ['chicken', 'flour', 'eggs', 'milk', 'oil', 'paprika', 'garlic'],
        steps: [
            'Marinate: Soak chicken pieces in buttermilk (or milk with lemon juice) for at least 1 hour to tenderize.',
            'Breading: Mix flour with paprika, garlic powder, salt, and pepper. Dip chicken from milk into flour, pressing to coat.',
            'Rest: Let the breaded chicken sit on a rack for 10 minutes (helps breading stick).',
            'Fry: Heat oil to 350°F (175°C). Fry chicken for 10-12 minutes until golden brown and internal temp reaches 165°F.',
            'Drain: Drain on a wire rack to keep it crispy (not paper towels).'
        ],
        nutrition: { calories: 600, protein: 40, fat: 35, carbs: 20 },
        tags: ['Fried', 'Crispy']
    },
    {
        title: 'Blueberry Pancakes',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
        cuisine: 'American', mealType: 'Breakfast', difficulty: 'Easy', time: 20, rating: 4.6,
        ingredients: ['flour', 'eggs', 'milk', 'butter', 'blueberry', 'maple syrup'],
        steps: [
            'Batter: Whisk flour, sugar, baking powder, and salt. In another bowl, whisk milk, egg, and melted butter. Combine gently.',
            'Fold: Gently fold in fresh blueberries. Do not overmix.',
            'Cook: Pour batter onto a hot, buttered griddle. Cook until bubbles form on the surface and edges look dry.',
            'Flip: Flip and cook for another 1-2 minutes until golden brown.',
            'Serve: Serve warm stacked high with a pat of butter and maple syrup.'
        ],
        nutrition: { calories: 400, protein: 10, fat: 15, carbs: 60 },
        tags: ['Breakfast', 'Sweet'], isVegetarian: true
    },
    {
        title: 'Chicken Caesar Salad',
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
        cuisine: 'American', mealType: 'Lunch', difficulty: 'Easy', time: 25, rating: 4.5,
        ingredients: ['chicken breast', 'lettuce', 'parmesan', 'bread', 'mayonnaise', 'lemon'],
        steps: [
            'Grill Chicken: Season chicken breast with salt and pepper. Grill until cooked through, then slice.',
            'Make Croutons: Cube bread, toss with olive oil, and bake at 400°F until crispy.',
            'Prep Greens: Chop Romaine lettuce into bite-sized pieces.',
            'Toss: In a large bowl, toss lettuce with Caesar dressing (mayo, lemon, parmesan, garlic, anchovy paste).',
            'Serve: Top with grilled chicken, croutons, and shaved parmesan cheese.'
        ],
        nutrition: { calories: 350, protein: 30, fat: 15, carbs: 20 },
        tags: ['Salad', 'Healthy']
    },
    {
        title: 'Macaroni and Cheese',
        image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
        cuisine: 'American', mealType: 'Dinner', difficulty: 'Medium', time: 30, rating: 4.7,
        ingredients: ['pasta', 'cheddar cheese', 'milk', 'butter', 'flour'],
        steps: [
            'Boil Pasta: Cook macaroni until al dente. Drain.',
            'Make Roux: Melt butter in a pot, whisk in flour and cook for 1 minute.',
            'Make Sauce: Slowly whisk in milk until smooth. Simmer until thickened.',
            'Add Cheese: Remove from heat. Stir in cheddar cheese until melted and smooth.',
            'Combine: Stir in the pasta. Optionally bake with breadcrumbs on top for a crunchy crust.'
        ],
        nutrition: { calories: 550, protein: 20, fat: 30, carbs: 60 },
        tags: ['Pasta', 'Cheesy'], isVegetarian: true
    },

    // =================================================================
    // 4. JAPANESE CUISINE
    // =================================================================
    {
        title: 'Salmon Sushi Roll',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Japanese', mealType: 'Lunch', difficulty: 'Hard', time: 60, rating: 4.8,
        ingredients: ['rice', 'salmon', 'avocado', 'seaweed', 'vinegar', 'soy sauce'],
        steps: [
            'Sushi Rice: Cook short-grain rice. While hot, mix gently with sushi vinegar, sugar, and salt. Let cool.',
            'Prepare: Place a sheet of Nori (seaweed) on a bamboo mat. Spread a thin layer of rice over it.',
            'Fill: Place strips of fresh salmon and avocado in the center.',
            'Roll: Lift the mat and roll tightly, squeezing gently to shape.',
            'Cut: Slice into bite-sized pieces with a sharp, wet knife. Serve with soy sauce and wasabi.'
        ],
        nutrition: { calories: 400, protein: 15, fat: 10, carbs: 60 },
        tags: ['Sushi', 'Seafood', 'Fresh']
    },
    {
        title: 'Miso Soup',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Japanese', mealType: 'Breakfast', difficulty: 'Easy', time: 15, rating: 4.5,
        ingredients: ['tofu', 'miso paste', 'seaweed', 'spring onion'],
        steps: [
            'Make Dashi: Bring water and dashi powder to a simmer.',
            'Add Ingredients: Add cubed tofu and dried wakame seaweed. Simmer for 2 minutes.',
            'Add Miso: Turn off the heat (Important! Boiling miso destroys flavor). Place miso paste in a ladle, submerge in broth, and whisk until dissolved.',
            'Serve: Garnish with chopped green onions and serve hot.'
        ],
        nutrition: { calories: 80, protein: 6, fat: 3, carbs: 10 },
        tags: ['Soup', 'Vegan'], isVegan: true
    },
    {
        title: 'Chicken Teriyaki',
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d29f29?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Japanese', mealType: 'Dinner', difficulty: 'Medium', time: 30, rating: 4.7,
        ingredients: ['chicken', 'soy sauce', 'sugar', 'ginger', 'rice'],
        steps: [
            'Sear Chicken: Pan-fry chicken thighs skin-side down until crispy and golden. Flip and cook through.',
            'Make Sauce: Mix soy sauce, mirin, sake, and sugar.',
            'Glaze: Pour sauce into the pan with chicken. Simmer until the sauce thickens and coats the chicken in a shiny glaze.',
            'Serve: Slice the chicken and serve over steamed rice. Drizzle extra sauce on top.'
        ],
        nutrition: { calories: 500, protein: 30, fat: 20, carbs: 45 },
        tags: ['Rice', 'Savory']
    },
    {
        title: 'Shrimp Tempura',
        image: 'https://images.unsplash.com/photo-1615486767794-4b70a80d882d?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Japanese', mealType: 'Lunch', difficulty: 'Medium', time: 40, rating: 4.6,
        ingredients: ['shrimp', 'flour', 'eggs', 'oil'],
        steps: [
            'Prep Shrimp: Clean shrimp and make small slits along the belly to straighten them.',
            'Make Batter: Mix flour, egg, and ice-cold water. Do not overmix; lumps are good.',
            'Dip: Holding the tail, dip shrimp into the cold batter.',
            'Fry: Deep fry in hot oil (340°F) for 2-3 minutes until the batter is light and crispy.',
            'Drain: Drain on paper towels and serve with Tentsuyu dipping sauce.'
        ],
        nutrition: { calories: 350, protein: 20, fat: 25, carbs: 30 },
        tags: ['Fried', 'Crispy']
    },
    {
        title: 'Shoyu Ramen',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Japanese', mealType: 'Dinner', difficulty: 'Hard', time: 120, rating: 4.8,
        ingredients: ['noodles', 'pork', 'eggs', 'soy sauce', 'spring onion'],
        steps: [
            'Broth: Simmer chicken bones, aromatics, and ginger for 3-4 hours to make a clear stock.',
            'Tare: Make a seasoning sauce (Tare) using soy sauce, mirin, and kombu.',
            'Noodles: Cook fresh ramen noodles in boiling water for 2 minutes. Drain well.',
            'Assemble: Place Tare in bowl, pour hot broth. Add noodles.',
            'Toppings: Top with Chashu pork slices, soft-boiled egg, bamboo shoots, and nori.'
        ],
        nutrition: { calories: 550, protein: 25, fat: 20, carbs: 65 },
        tags: ['Noodle', 'Soup']
    },

    // =================================================================
    // 5. THAI CUISINE
    // =================================================================
    {
        title: 'Pad Thai',
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Thai', mealType: 'Lunch', difficulty: 'Medium', time: 30, rating: 4.7,
        ingredients: ['rice noodles', 'shrimp', 'eggs', 'peanuts', 'bean sprouts', 'lime'],
        steps: [
            'Soak Noodles: Soak dried rice noodles in warm water for 30 mins until pliable but firm.',
            'Stir Fry: Heat oil in a wok. Fry shrimp and tofu until cooked. Push to side.',
            'Scramble: Crack egg into the wok and scramble.',
            'Combine: Add noodles and Pad Thai sauce (tamarind, fish sauce, sugar). Stir fry until noodles are soft.',
            'Finish: Toss with bean sprouts and chives. Serve with crushed peanuts and lime.'
        ],
        nutrition: { calories: 500, protein: 20, fat: 15, carbs: 65 },
        tags: ['Noodle', 'Stir Fry']
    },
    {
        title: 'Thai Green Curry',
        image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Thai', mealType: 'Dinner', difficulty: 'Medium', time: 45, rating: 4.8,
        ingredients: ['chicken', 'coconut milk', 'curry powder', 'bamboo shoots', 'basil'],
        steps: [
            'Fry Paste: Heat a little coconut milk in a pan until oil separates. Add green curry paste and fry until fragrant.',
            'Cook Meat: Add chicken pieces and stir to coat.',
            'Simmer: Add remaining coconut milk, bamboo shoots, and kaffir lime leaves. Simmer for 10 minutes.',
            'Season: Add fish sauce and palm sugar to taste.',
            'Serve: Stir in fresh Thai basil leaves off the heat. Serve with jasmine rice.'
        ],
        nutrition: { calories: 600, protein: 25, fat: 40, carbs: 20 },
        tags: ['Curry', 'Spicy']
    },
    {
        title: 'Mango Sticky Rice',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Thai', mealType: 'Dessert', difficulty: 'Medium', time: 40, rating: 4.9,
        ingredients: ['rice', 'mango', 'coconut milk', 'sugar'],
        steps: [
            'Steam Rice: Soak glutinous rice overnight, then steam until tender.',
            'Make Sauce: Heat coconut milk with sugar and salt until dissolved (do not boil).',
            'Mix: Pour half the sauce over the hot rice. Cover and let sit for 20 minutes to absorb.',
            'Serve: Place rice on a plate next to sliced ripe mango. Drizzle remaining sauce on top and sprinkle with toasted sesame seeds.'
        ],
        nutrition: { calories: 400, protein: 5, fat: 15, carbs: 70 },
        tags: ['Dessert', 'Sweet', 'Vegan']
    },
    {
        title: 'Tom Yum Soup',
        image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b485c?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Thai', mealType: 'Dinner', difficulty: 'Medium', time: 30, rating: 4.7,
        ingredients: ['shrimp', 'mushroom', 'lemongrass', 'lime', 'chili paste'],
        steps: [
            'Broth: Boil water or chicken stock. Add bruised lemongrass, galangal, and kaffir lime leaves.',
            'Cook: Add mushrooms and shrimp. Cook until shrimp turns pink.',
            'Season: Stir in chili paste (Nam Prik Pao) and fish sauce.',
            'Finish: Turn off heat. Add lime juice and crushed chili peppers (adding lime while boiling can make it bitter).',
            'Garnish: Top with cilantro and serve.'
        ],
        nutrition: { calories: 150, protein: 15, fat: 5, carbs: 10 },
        tags: ['Soup', 'Spicy']
    },
    {
        title: 'Papaya Salad (Som Tum)',
        image: 'https://images.unsplash.com/photo-1626804475315-1874d1732698?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Thai', mealType: 'Lunch', difficulty: 'Easy', time: 20, rating: 4.6,
        ingredients: ['papaya', 'tomato', 'lime', 'fish sauce', 'peanuts'],
        steps: [
            'Prep: Shred green papaya and carrot.',
            'Pound: In a mortar, pound garlic and chili. Add long beans and pound gently.',
            'Dress: Add fish sauce, lime juice, and palm sugar. Mix well.',
            'Toss: Add shredded papaya and tomato. Toss gently to combine flavors.',
            'Serve: Top with roasted peanuts and dried shrimp (optional).'
        ],
        nutrition: { calories: 200, protein: 5, fat: 5, carbs: 30 },
        tags: ['Salad', 'Spicy']
    },

    // =================================================================
    // 6. INDIAN CUISINE
    // =================================================================
    {
        title: 'Butter Chicken',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Indian', mealType: 'Dinner', difficulty: 'Medium', time: 60, rating: 4.9,
        ingredients: ['chicken', 'tomato', 'butter', 'heavy cream', 'spices'],
        steps: [
            'Marinate: Mix chicken with yogurt, lemon, ginger, garlic, and spices. Chill for 1 hour.',
            'Cook Chicken: Grill or pan-fry chicken pieces until charred.',
            'Make Sauce: Simmer tomato puree with butter and spices (garam masala, cumin).',
            'Combine: Add chicken to sauce. Stir in heavy cream and simmer for 5 minutes.',
            'Serve: Garnish with cilantro and serve with naan.'
        ],
        nutrition: { calories: 700, protein: 35, fat: 50, carbs: 15 },
        tags: ['Curry', 'Creamy']
    },
    {
        title: 'Garlic Naan',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Indian', mealType: 'Dinner', difficulty: 'Medium', time: 90, rating: 4.6,
        ingredients: ['flour', 'yogurt', 'yeast', 'butter', 'garlic'],
        steps: [
            'Dough: Mix flour, yeast, yogurt, water, and salt. Knead until smooth.',
            'Rise: Let dough rise in a warm place for 1 hour.',
            'Shape: Divide dough and roll into ovals.',
            'Cook: Place on a hot cast-iron skillet. Cook until bubbly and charred spots appear.',
            'Finish: Brush immediately with melted garlic butter.'
        ],
        nutrition: { calories: 300, protein: 8, fat: 10, carbs: 50 },
        tags: ['Bread', 'Vegetarian']
    },
    {
        title: 'Lentil Dal',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Indian', mealType: 'Dinner', difficulty: 'Easy', time: 40, rating: 4.5,
        ingredients: ['lentils', 'onion', 'tomato', 'garlic', 'turmeric', 'cumin'],
        steps: [
            'Boil: Rinse lentils and boil in water with turmeric until soft and mushy.',
            'Tadka (Tempering): Heat oil in a small pan. Fry cumin seeds, onions, garlic, and tomatoes.',
            'Combine: Pour the spiced oil mixture over the cooked lentils.',
            'Simmer: Simmer together for 5 minutes. Garnish with cilantro.'
        ],
        nutrition: { calories: 350, protein: 18, fat: 10, carbs: 45 },
        tags: ['Vegan', 'Healthy'], isVegan: true
    },
    {
        title: 'Chicken Tikka Masala',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Indian', mealType: 'Dinner', difficulty: 'Medium', time: 50, rating: 4.8,
        ingredients: ['chicken', 'yogurt', 'tomato', 'onion', 'garlic', 'cumin'],
        steps: [
            'Marinate: Coat chicken in spiced yogurt marinade.',
            'Grill: Skewer and grill chicken until cooked.',
            'Sauce: Sauté onions, ginger, and garlic. Add spices and tomato puree. Simmer.',
            'Finish: Add grilled chicken to the sauce. Simmer for 10 minutes to blend flavors.',
            'Serve: Best served with basmati rice.'
        ],
        nutrition: { calories: 600, protein: 30, fat: 25, carbs: 20 },
        tags: ['Curry', 'Spicy']
    },
    {
        title: 'Samosas',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Indian', mealType: 'Snack', difficulty: 'Hard', time: 60, rating: 4.7,
        ingredients: ['flour', 'potato', 'peas', 'oil', 'cumin', 'coriander'],
        steps: [
            'Dough: Mix flour, oil, and water to make a stiff dough. Rest for 20 mins.',
            'Filling: Boil potatoes and mash roughly. Cook with peas and spices (cumin, coriander, garam masala).',
            'Shape: Roll dough, cut in half. Form a cone, stuff with filling, and seal edges with water.',
            'Fry: Deep fry in medium-hot oil until golden brown and crispy.'
        ],
        nutrition: { calories: 250, protein: 5, fat: 12, carbs: 30 },
        tags: ['Snack', 'Vegetarian'], isVegetarian: true
    },

    // =================================================================
    // 7. MEXICAN CUISINE
    // =================================================================
    {
        title: 'Beef Tacos',
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Mexican', mealType: 'Dinner', difficulty: 'Easy', time: 25, rating: 4.7,
        ingredients: ['beef', 'tortilla', 'onion', 'cilantro', 'lime'],
        steps: [
            'Cook Beef: Sauté ground beef in a skillet until browned. Drain fat. Add taco seasoning and a splash of water.',
            'Warm Tortillas: Heat corn tortillas in a dry pan until warm and pliable.',
            'Assemble: Spoon beef into tortillas.',
            'Top: Garnish with diced white onion, fresh cilantro, and salsa.',
            'Serve: Serve immediately with lime wedges.'
        ],
        nutrition: { calories: 400, protein: 25, fat: 20, carbs: 35 },
        tags: ['Street Food', 'Spicy']
    },
    {
        title: 'Guacamole',
        image: 'https://images.unsplash.com/photo-1574315042621-503463a53444?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Mexican', mealType: 'Snack', difficulty: 'Easy', time: 10, rating: 4.8,
        ingredients: ['avocado', 'onion', 'tomato', 'lime', 'cilantro'],
        steps: [
            'Mash: Halve avocados, remove pit, and scoop flesh into a bowl. Mash roughly with a fork.',
            'Mix: Stir in diced onion, tomato, jalapeño, and cilantro.',
            'Season: Add plenty of lime juice and salt. Taste and adjust.',
            'Serve: Serve with tortilla chips.'
        ],
        nutrition: { calories: 300, protein: 5, fat: 25, carbs: 20 },
        tags: ['Dip', 'Vegetarian'], isVegetarian: true
    },
    {
        title: 'Chicken Quesadilla',
        image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Mexican', mealType: 'Lunch', difficulty: 'Easy', time: 20, rating: 4.6,
        ingredients: ['tortilla', 'chicken', 'cheese'],
        steps: [
            'Assemble: Place a flour tortilla in a pan. Sprinkle cheese and cooked chicken over half.',
            'Fold: Fold the tortilla over to make a half-moon.',
            'Cook: Grill on medium heat until golden brown and cheese is melted, flipping once.',
            'Serve: Slice into wedges and serve with sour cream and salsa.'
        ],
        nutrition: { calories: 500, protein: 25, fat: 25, carbs: 40 },
        tags: ['Cheesy', 'Quick']
    },
    {
        title: 'Burrito Bowl',
        image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Mexican', mealType: 'Lunch', difficulty: 'Easy', time: 25, rating: 4.7,
        ingredients: ['rice', 'black beans', 'corn', 'chicken', 'salsa'],
        steps: [
            'Base: Place cooked cilantro-lime rice in a bowl.',
            'Add: Top with warmed black beans, corn, and grilled chicken strips.',
            'Garnish: Add fresh salsa, avocado slices, and a dollop of sour cream.',
            'Finish: Drizzle with hot sauce if desired.'
        ],
        nutrition: { calories: 550, protein: 30, fat: 15, carbs: 65 },
        tags: ['Healthy', 'Bowl'], isGlutenFree: true
    },
    {
        title: 'Churros',
        image: 'https://images.unsplash.com/photo-1624371414361-e670edf4898d?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Mexican', mealType: 'Dessert', difficulty: 'Medium', time: 40, rating: 4.8,
        ingredients: ['flour', 'sugar', 'cinnamon', 'oil'],
        steps: [
            'Dough: Boil water, butter, and sugar. Stir in flour vigorously until a ball forms. Let cool slightly, then beat in eggs.',
            'Pipe: Put dough in a piping bag with a star tip.',
            'Fry: Pipe strips of dough into hot oil. Fry until golden brown.',
            'Coat: Drain and immediately roll in cinnamon sugar.',
            'Serve: Serve warm with chocolate dipping sauce.'
        ],
        nutrition: { calories: 300, protein: 4, fat: 15, carbs: 40 },
        tags: ['Sweet', 'Fried'], isVegetarian: true
    },

    // =================================================================
    // 8. CHINESE CUISINE
    // =================================================================
    {
        title: 'Yangzhou Fried Rice',
        image: 'https://images.unsplash.com/photo-1603133872878-684f1084261d?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Chinese', mealType: 'Dinner', difficulty: 'Easy', time: 20, rating: 4.5,
        ingredients: ['rice', 'eggs', 'pork', 'shrimp', 'peas', 'soy sauce'],
        steps: [
            'Prep: Use cold, day-old cooked rice for best results.',
            'Scramble: Scramble eggs in a wok and remove.',
            'Stir Fry: Fry diced pork (Char Siu), shrimp, peas, and carrots.',
            'Combine: Add rice. Stir fry on high heat to break up clumps.',
            'Season: Add soy sauce, sesame oil, and the cooked eggs. Toss well.'
        ],
        nutrition: { calories: 600, protein: 20, fat: 15, carbs: 80 },
        tags: ['Rice', 'Wok']
    },
    {
        title: 'Kung Pao Chicken',
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Chinese', mealType: 'Dinner', difficulty: 'Medium', time: 30, rating: 4.7,
        ingredients: ['chicken', 'peanuts', 'chili pepper', 'soy sauce'],
        steps: [
            'Marinate: Cube chicken and marinate with soy sauce and cornstarch.',
            'Sauce: Mix soy sauce, vinegar, sugar, and cornstarch in a bowl.',
            'Cook: Stir fry chicken until golden. Add dried chili peppers and Sichuan peppercorns.',
            'Finish: Pour in sauce and toss until thickened. Stir in roasted peanuts.'
        ],
        nutrition: { calories: 450, protein: 25, fat: 20, carbs: 15 },
        tags: ['Spicy', 'Wok']
    },
    {
        title: 'Stir-Fried Veggies',
        image: 'https://images.unsplash.com/photo-1527056456075-8ceda0498704?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Chinese', mealType: 'Dinner', difficulty: 'Easy', time: 15, rating: 4.4,
        ingredients: ['broccoli', 'carrot', 'garlic', 'soy sauce', 'oyster sauce'],
        steps: [
            'Blanch: Briefly boil broccoli and carrots, then drain.',
            'Sauté: Heat oil in a wok. Fry minced garlic until fragrant.',
            'Fry: Add vegetables and stir-fry on high heat.',
            'Season: Add a mix of oyster sauce, soy sauce, and a splash of water. Cook for 1 minute.',
            'Serve: Serve hot as a side dish.'
        ],
        nutrition: { calories: 150, protein: 5, fat: 8, carbs: 15 },
        tags: ['Vegetarian', 'Healthy'], isVegetarian: true
    },
    {
        title: 'Wonton Soup',
        image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Chinese', mealType: 'Dinner', difficulty: 'Medium', time: 40, rating: 4.6,
        ingredients: ['pork', 'shrimp', 'flour', 'stock'],
        steps: [
            'Filling: Mix ground pork, shrimp, ginger, and soy sauce.',
            'Wrap: Place a teaspoon of filling in a wonton wrapper. Seal edges with water.',
            'Broth: Bring chicken stock to a boil. Add ginger and sesame oil.',
            'Cook: Boil wontons in the broth for 3-4 minutes until they float.',
            'Serve: Garnish with scallions and bok choy.'
        ],
        nutrition: { calories: 300, protein: 15, fat: 10, carbs: 35 },
        tags: ['Soup', 'Comfort Food']
    },
    {
        title: 'Sweet and Sour Pork',
        image: 'https://images.unsplash.com/photo-1593560708920-638928ce7126?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Chinese', mealType: 'Dinner', difficulty: 'Medium', time: 40, rating: 4.5,
        ingredients: ['pork', 'pineapple', 'bell pepper', 'vinegar', 'sugar', 'ketchup'],
        steps: [
            'Batter: Dip pork cubes in egg and cornstarch.',
            'Fry: Deep fry pork twice for extra crispiness.',
            'Sauce: Simmer ketchup, vinegar, sugar, and pineapple juice until thick.',
            'Toss: Add fried pork, pineapple chunks, and peppers to the sauce. Toss quickly to coat.'
        ],
        nutrition: { calories: 550, protein: 20, fat: 30, carbs: 50 },
        tags: ['Sweet', 'Fried']
    },

    // =================================================================
    // 9. FRENCH CUISINE
    // =================================================================
    {
        title: 'French Toast',
        image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80',
        cuisine: 'French', mealType: 'Breakfast', difficulty: 'Easy', time: 20, rating: 4.7,
        ingredients: ['bread', 'eggs', 'milk', 'cinnamon', 'butter'],
        steps: [
            'Custard: Whisk eggs, milk, cinnamon, vanilla, and a pinch of salt.',
            'Soak: Dip thick slices of brioche or stale bread into the custard, letting it soak for 10 seconds per side.',
            'Cook: Melt butter in a pan. Fry bread slices until golden brown and crisp on both sides.',
            'Serve: Serve hot, dusted with powdered sugar and drizzled with maple syrup.'
        ],
        nutrition: { calories: 450, protein: 12, fat: 20, carbs: 55 },
        tags: ['Breakfast', 'Sweet'], isVegetarian: true
    },
    {
        title: 'Ratatouille',
        image: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?auto=format&fit=crop&w=800&q=80',
        cuisine: 'French', mealType: 'Dinner', difficulty: 'Medium', time: 60, rating: 4.6,
        ingredients: ['zucchini', 'eggplant', 'tomato', 'bell pepper', 'onion', 'olive oil'],
        steps: [
            'Sauce: Spread a layer of tomato and bell pepper sauce (piperade) at the bottom of a baking dish.',
            'Slice: Thinly slice zucchini, eggplant, and tomatoes.',
            'Arrange: Arrange vegetable slices in a spiral pattern over the sauce.',
            'Season: Drizzle with olive oil, thyme, and garlic.',
            'Bake: Cover with parchment paper and bake at 375°F for 45 minutes until tender.'
        ],
        nutrition: { calories: 200, protein: 5, fat: 10, carbs: 25 },
        tags: ['Vegetarian', 'Healthy', 'Classic'], isVegetarian: true
    },
    {
        title: 'Crepes',
        image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80',
        cuisine: 'French', mealType: 'Dessert', difficulty: 'Medium', time: 30, rating: 4.8,
        ingredients: ['flour', 'milk', 'eggs', 'butter', 'sugar'],
        steps: [
            'Batter: Blend flour, milk, eggs, melted butter, and sugar until smooth. Let rest for 15 mins.',
            'Cook: Heat a non-stick pan. Pour a small ladle of batter and swirl to coat the bottom thinly.',
            'Flip: Cook for 1 minute, flip, and cook for 30 seconds.',
            'Serve: Fill with Nutella, fruit, or lemon and sugar. Fold into triangles.'
        ],
        nutrition: { calories: 300, protein: 6, fat: 12, carbs: 40 },
        tags: ['Dessert', 'Sweet'], isVegetarian: true
    },
    {
        title: 'Onion Soup',
        image: 'https://images.unsplash.com/photo-1608500218860-63959c991e23?auto=format&fit=crop&w=800&q=80',
        cuisine: 'French', mealType: 'Dinner', difficulty: 'Medium', time: 60, rating: 4.7,
        ingredients: ['onion', 'beef', 'bread', 'cheese'],
        steps: [
            'Caramelize: Cook sliced onions in butter on low heat for 40 minutes until dark brown and sweet.',
            'Simmer: Add beef broth and simmer for 20 minutes.',
            'Broil: Ladle soup into bowls. Top with a slice of baguette and Gruyère cheese.',
            'Melt: Place under the broiler until cheese is bubbly and browned.'
        ],
        nutrition: { calories: 350, protein: 15, fat: 15, carbs: 30 },
        tags: ['Soup', 'Comfort Food']
    },
    {
        title: 'Quiche Lorraine',
        image: 'https://images.unsplash.com/photo-1612182062633-9524ca86c5dc?auto=format&fit=crop&w=800&q=80',
        cuisine: 'French', mealType: 'Lunch', difficulty: 'Medium', time: 60, rating: 4.6,
        ingredients: ['eggs', 'heavy cream', 'bacon', 'flour', 'cheese'],
        steps: [
            'Crust: Prepare pie crust and blind bake it.',
            'Filling: Whisk eggs and heavy cream with salt and nutmeg.',
            'Add ins: Scatter cooked bacon and cheese (Gruyère) into the crust.',
            'Bake: Pour egg mixture over. Bake at 375°F for 35-40 minutes until set.'
        ],
        nutrition: { calories: 500, protein: 20, fat: 35, carbs: 25 },
        tags: ['Baked', 'Savory']
    },

    // =================================================================
    // 10. GREEK CUISINE
    // =================================================================
    {
        title: 'Greek Salad',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Greek', mealType: 'Lunch', difficulty: 'Easy', time: 10, rating: 4.6,
        ingredients: ['cucumber', 'tomato', 'feta', 'olive oil', 'olives'],
        steps: [
            'Chop: Cut cucumbers and tomatoes into large chunks.',
            'Combine: Place in a bowl with Kalamata olives and thinly sliced red onion.',
            'Cheese: Place a block of feta cheese on top.',
            'Dress: Drizzle with plenty of olive oil and sprinkle with dried oregano. Serve immediately.'
        ],
        nutrition: { calories: 300, protein: 10, fat: 25, carbs: 10 },
        tags: ['Salad', 'Healthy'], isVegetarian: true
    },
    {
        title: 'Chicken Souvlaki',
        image: 'https://images.unsplash.com/photo-1532635270-c09dac425ca9?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Greek', mealType: 'Dinner', difficulty: 'Medium', time: 30, rating: 4.7,
        ingredients: ['chicken', 'lemon', 'oregano', 'yogurt'],
        steps: [
            'Marinate: Mix chicken cubes with lemon juice, olive oil, garlic, and oregano. Let sit for 30 mins.',
            'Skew: Thread chicken onto skewers.',
            'Grill: Grill on high heat, turning occasionally, until cooked through and charred.',
            'Serve: Serve with pita bread and Tzatziki sauce.'
        ],
        nutrition: { calories: 400, protein: 35, fat: 15, carbs: 5 },
        tags: ['Grilled', 'Healthy']
    },

    // =================================================================
    // 11. OTHERS / HEALTHY
    // =================================================================
    {
        title: 'Oatmeal with Berries',
        image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80',
        cuisine: 'American', mealType: 'Breakfast', difficulty: 'Easy', time: 10, rating: 4.5,
        ingredients: ['oats', 'milk', 'banana', 'strawberry'],
        steps: [
            'Cook: Bring milk (or water) to a boil. Stir in oats and reduce heat.',
            'Simmer: Cook for 5-10 minutes until creamy.',
            'Toppings: Top with sliced banana, fresh strawberries, and a drizzle of honey.'
        ],
        nutrition: { calories: 350, protein: 10, fat: 8, carbs: 60 },
        tags: ['Healthy', 'Breakfast'], isVegetarian: true
    },
    {
        title: 'Green Smoothie',
        image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=800&q=80',
        cuisine: 'International', mealType: 'Snack', difficulty: 'Easy', time: 5, rating: 4.8,
        ingredients: ['spinach', 'banana', 'apple', 'water'],
        steps: [
            'Combine: Add spinach, frozen banana, chopped apple, and water to a blender.',
            'Blend: Blend on high speed until completely smooth.',
            'Serve: Pour into a glass and drink immediately for maximum nutrients.'
        ],
        nutrition: { calories: 150, protein: 2, fat: 0, carbs: 35 },
        tags: ['Drink', 'Healthy'], isVegan: true
    },
    {
        title: 'Grilled Salmon',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80',
        cuisine: 'International', mealType: 'Dinner', difficulty: 'Medium', time: 20, rating: 4.9,
        ingredients: ['salmon', 'asparagus', 'lemon', 'butter'],
        steps: [
            'Season: Pat salmon dry and season with salt and pepper.',
            'Sear: Heat butter in a pan. Place salmon skin-side down. Cook until skin is crispy (5 mins).',
            'Flip: Flip and cook for another 2-3 minutes.',
            'Veggies: Sauté asparagus in the same pan with garlic.',
            'Serve: Serve salmon with asparagus and a wedge of lemon.'
        ],
        nutrition: { calories: 450, protein: 35, fat: 30, carbs: 5 },
        tags: ['Keto', 'Healthy']
    }
];

// --- MAIN SEED FUNCTION ---
const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Connected');

        // 1. DELETE OLD RECIPES
        await Recipe.deleteMany({});
        console.log('✅ Đã xóa sạch công thức cũ.');

        // 2. CREATE ADMIN
        let user = await User.findOne({ email: 'admin@mysteremeal.com' });
        if (!user) {
            user = await User.create({
                name: 'Master Chef',
                email: 'admin@mysteremeal.com',
                password: 'password123',
                isAdmin: true
            });
            console.log('Đã tạo user Admin mới.');
        } else {
            console.log(`Tìm thấy user Admin: ${user.name}`);
        }

        // 3. INSERT RECIPES
        const recipesWithAuthor = recipesData.map(r => ({ ...r, author: user._id }));
        const createdRecipes = await Recipe.insertMany(recipesWithAuthor);
        console.log(`Đã nạp thành công ${createdRecipes.length} công thức chuẩn xịn!`);

        // 4. UPDATE USER
        user.createdRecipes = createdRecipes.map(r => r._id);
        await user.save();

        console.log('Hoàn tất! Vào web kiểm tra ngay!');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi:', error);
        process.exit(1);
    }
};
seedDB();