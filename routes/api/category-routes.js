const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// Get all category information and associated Products
router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const catData = await Category.findAll({
      include:[{model:Product}],
    });

    const categories = catData.map((cat) => cat.get({ plain: true }));
    console.log(categories);
   
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err.message);
  }

});

// Get individual category route and associated Products
router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category = await Category.findOne({
      where:{id: req.params.id},
      include:[{model:Product}],
    });

    
    console.log(category);
   
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Create a new category route
router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCat = await Category.create({
      ...req.body
    });

    res.status(200).json(newCat);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update the category route
router.put('/:id', async (req, res) => {
  // update a category by its `id` value
   console.log('updating category');
    try {
        const updateData = await Category.update(
            {...req.body },
            {where:{id:req.params.id}}
            );
        if (!updateData) {
            res.status(404).json({ message: 'No category found with this id!' });
            return;
          }
          res.status(200).json(updateData);
  } catch (err) {
    res.status(500).json(err);
  }

});

// Delete the category route
router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  console.log('gonna del a cat.');
  try {
    // update product table to signal needing category. set to Unassigned code 1
    const updateProducts = await Product.update(
      {category_id:1 },
      {where:{category_id:req.params.id}}
    );

    try{
        if (req.params.id != 1){      
          res.status(404).json({ message: "Can't delete 1 - Reserved for Unassigned" });
        } 
        const catData = await Category.destroy({
          where: {
            id: req.params.id
          },
        });
    
        if (!catData) {
          res.status(404).json({ message: 'No category found with this id!' });
          return;
        }

        //finally send our response.
        res.status(200).json(catData);
      }
      catch(err){
        res.status(500).json(err);
      }

    

  } catch (err) {
    res.status(500).json(err);
  }

});

module.exports = router;
