package org.fjsei.yewu.resolver.sei.original;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import org.fjsei.yewu.entity.sei.*;
import org.fjsei.yewu.entity.sei.inspect.ISP;
import org.fjsei.yewu.entity.sei.inspect.ISPRepository;
import org.fjsei.yewu.entity.sei.inspect.Task;
import org.fjsei.yewu.entity.sei.inspect.TaskRepository;
import org.fjsei.yewu.input.WhereTree;
import org.fjsei.yewu.jpa.ModelFiltersImpl;
import org.fjsei.yewu.jpa.PageOffsetFirst;
import org.fjsei.yewu.service.security.JwtUserDetailsService;
import org.hibernate.Metamodel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;
import javax.persistence.metamodel.EntityType;
import java.util.List;
import java.util.Set;


@Component
public class ReportMgrQuery implements GraphQLQueryResolver {

    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;
    @Autowired
    private EQPRepository eQPRepository;
    @Autowired
    private ISPRepository iSPRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private UnitRepository unitRepository;
    @Autowired
    private PositionRepository positionRepository;
    @Autowired
    private AuthorityRepository authorityRepository;


    @PersistenceContext(unitName = "entityManagerFactorySei")
    private EntityManager emSei;




}


/*
graphql需要参数的接口函数/Type输出isp(带参数)的/等，注意！参数不能直接用POJO的java类来传递参数对象，需要基本数据类型或其嵌套结构；否则报错：
输出可以用java对象，输入却免谈． com.coxautodev.graphql.tools.SchemaError: Expected type 'ISP' to be a GraphQLInputType, but it wasn't!
 Was a type only permitted for object types incorrectly used as an input type, or vice-versa? at com.coxautodev.graphql.tools.SchemaParser.d。
*/
