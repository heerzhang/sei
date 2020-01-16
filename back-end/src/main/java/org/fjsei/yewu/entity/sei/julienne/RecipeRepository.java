package org.fjsei.yewu.entity.sei.julienne;


import org.fjsei.yewu.entity.sei.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

//JPA的核心，数据库装入,到对应的实体类去。

public interface RecipeRepository extends JpaRepository<Recipe, Long>, JpaSpecificationExecutor<Recipe> {


 //   List<Recipe> findAllByCreatedByEquals(User user);


}

