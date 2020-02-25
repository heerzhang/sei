package org.fjsei.yewu.entity.sei.oldsys;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

//JPA的核心，数据库装入,到对应的实体类去。

public interface HouseMgeRepository extends JpaRepository<HouseMge, Long>, JpaSpecificationExecutor<HouseMge> {


}

