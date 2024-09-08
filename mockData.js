
// Mock data for users, posts, and comments
const users = [
    { id: 1, name: 'Sunny ', email: 'sunny@apples.com' },
    { id: 2, name: 'Cloud ', email: 'cloud@bananas.com' },
    { id: 3, name: 'Casper ', email: 'casper@parsley.com' }
];

const posts = [
    {
        id: 1, userId: 1, title: 'Attempted Grooming', body: 'Today, my human tried to GRAB me. I was peacefully napping when all of a sudden, I feel hands on me! I cant believe she would ever attempt such a thing! Id rather be hopping around or munching on treats, not sitting still for a brushing!🍏🌟 #GroomingGrump #FluffyStruggles'
    },
    { id: 2, userId: 1, title: 'Carrot Dreams and Cozy Naps', body: 'Hello, bunny buddies! 🥕✨ Ever dream of a giant carrot just for you? I do! But until then, lets enjoy our cozy burrows and a good nap. Sweet dreams, and may your day be as delightful as a sunny patch of clover! 🌸💤 #BunnyDreams #CozyCuddles' },
    {
        id: 3, userId: 2, title: 'Parsley, my love', body: 'Hello, herb enthusiasts! 🐰🥳 Todays treat: PARSLEY! Its not just a garnish—its a bunnys delight! Crunchy, fresh, and oh-so-green, parsley is packed with nutrients and makes for a pawsitively delicious snack. Just a nibble here and there, and were hopping with joy! 🥗✨ #ParsleyLove #BunnyBites'
    },
];

const comments = [
    { id: 1, postId: 1, body: 'I cant believe this!!!😠✂️' },
    { id: 2, postId: 2, body: 'Sweet dreams and crunchy snacks!😴💚' },
    { id: 3, postId: 3, body: '🐰💚 #ParsleyParty.' },
    { id: 4, postId: 1, body: 'WOW!!! This is just unacceptable' },
    { id: 5, postId: 1, body: 'Ugh grooming really is the worst!' },
    { id: 6, postId: 2, body: 'Forever dreaming of snacks🥕💤 ' },
    { id: 7, postId: 3, body: "Yummy! I love parsley!💚💚💚" }

];

module.exports = { users, posts, comments };
