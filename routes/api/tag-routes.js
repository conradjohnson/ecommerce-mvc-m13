const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
// Route to get all tags.
router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include:[{model:Product}],
    });

    const tags = tagData.map((tag) => tag.get({ plain: true }));
    console.log(tags);
   
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err.message);
  }



});

// Route to get tag by id
router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findOne({
      where:{id: req.params.id},
      include:[{model:Product}],
    });

    
    console.log(tag);
   
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Route to create tag
router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create({
      ...req.body
    });

    res.status(200).json(newTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route to update a tag
router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  
    try {
        console.log('updating tag');
        const updateData = await Tag.update(
            {...req.body },
            {where:{id:req.params.id}}
            );
        if (!updateData) {
            res.status(404).json({ message: 'No tag found with this id!' });
            return;
          }
        res.status(200).json(updateData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to delete tag and producttag associations.
router.delete('/:id', async (req, res) => {
  // delete one tag by its `id` value
  
  console.log('gonna del a tag.');
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      },
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id.' });
      return;
    }

    // delete producttags with same tag id.
    try{
      const prodTagData = await ProductTag.destroy({
        where: {
          tag_id: req.params.id
        },
      });
      // Tags may not be referenced , so if nothing deleted, no worries, move on.
      //if both successful, send response
      res.status(200).json(tagData);
    }
    catch (err){
      res.status(500).json(err.message)
    }
    
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
