import log from "../utils/log.js";

import pointOfInterestCategoryService from "../services/pointOfInterestCategoryService.js";

export default {
    getAllPointOfInterestCategories (req, res) {
        pointOfInterestCategoryService.getAllPointOfInterestCategories().then((pointOfInterestCategories) => {
            res.send(pointOfInterestCategories);
        }).catch((err) => {
            log.err(" <= RES /pointofinterestcategory ERROR db error.", err);
            res.sendStatus(500);
        });
    }
};