package org.fjsei.yewu.entity.sei.oldsys;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
public interface HouseMgeRepository extends JpaRepository<HouseMge, Long>, JpaSpecificationExecutor<HouseMge> {
}