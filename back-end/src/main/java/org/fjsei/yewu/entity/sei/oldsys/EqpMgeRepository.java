package org.fjsei.yewu.entity.sei.oldsys;


import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

//JPA的核心，数据库装入,到对应的实体类去。

public interface EqpMgeRepository extends JpaRepository<EqpMge, Long>, JpaSpecificationExecutor<EqpMge> {


 //   List<EqpMge> findAllByCreatedByEquals(User user);
    List<EqpMge>  findAllByEQPCODIsLike(String codlike);

    //findAllByEQP_CODIsLike(String codlike);
}

