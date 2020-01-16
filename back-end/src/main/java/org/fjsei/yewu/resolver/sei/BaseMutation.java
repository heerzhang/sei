package org.fjsei.yewu.resolver.sei;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import org.fjsei.yewu.entity.sei.*;
import org.fjsei.yewu.entity.sei.inspect.ISP;
import org.fjsei.yewu.entity.sei.inspect.ISPRepository;
import org.fjsei.yewu.entity.sei.inspect.Task;
import org.fjsei.yewu.entity.sei.inspect.TaskRepository;
import org.fjsei.yewu.exception.BookNotFoundException;
import org.fjsei.yewu.input.DeviceCommonInput;
import org.fjsei.yewu.security.JwtTokenUtil;
import org.fjsei.yewu.security.JwtUser;
import org.fjsei.yewu.service.security.JwtUserDetailsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.persistence.*;
import javax.persistence.criteria.*;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import static org.hibernate.cfg.AvailableSettings.JPA_SHARED_CACHE_RETRIEVE_MODE;
import static org.hibernate.cfg.AvailableSettings.JPA_SHARED_CACHE_STORE_MODE;


//实际相当于controller;
//这个类名字不能重复简明！
//GraphQL有非常重要的一个特点：强类型,自带graphQL基本类型标量Int, Float, String, Boolean和ID。　https://segmentfault.com/a/1190000011263214
//乐观锁确保任何更新或删除不会被无意地覆盖或丢失。悲观锁会在数据库级别上锁实体会引起DB级死锁。 https://blog.csdn.net/neweastsun/article/details/82318734

@Component
public class BaseMutation implements GraphQLMutationResolver {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

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
    private EntityManager emSei;                //EntityManager相当于hibernate.Session：

    @Autowired
    private final JwtTokenUtil jwtTokenUtil=new JwtTokenUtil();

    @Transactional
    public EQP newEQP(String cod,String type,String oid) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        EQP eQP = new EQP(cod,type,oid);
        eQPRepository.save(eQP);
        return eQP;
    }

     @Transactional
    public Position newPosition(String address,String building,String area,String lng,String lat) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        Position position = new Position(address,area,building);
        position.setLngAndLat(lng,lat);
        positionRepository.save(position);
        return position;
    }

    @Transactional
    public Report newReport(String type,String no,Long ispId) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        ISP isp = iSPRepository.findById(ispId).orElse(null);
        Assert.isTrue(isp != null,"未找到isp:"+isp);
        Report report = new Report(type,no,isp);
        reportRepository.save(report);
        return report;
    }

    @Transactional
    public Report buildReport(Long ispId,String no,String path) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        ISP isp = iSPRepository.findById(ispId).orElse(null);
        Assert.isTrue(isp != null,"未找到isp:"+isp);
        Report report = new Report(path,isp,no);
        reportRepository.save(report);
        return report;
    }

    @Transactional
    public Task newTask(Long devsId) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        EQP eQP = eQPRepository.findById(devsId).orElse(null);
        Assert.isTrue(eQP != null,"未找到eQP:"+eQP);
        Task task = new Task();
        List<EQP> devs=new ArrayList<>();
        devs.add(eQP);
        task.setDevs(devs);
        taskRepository.save(task);
        return task;
    }

    @Transactional
    public Task buildTask(Long devsId,String dep,String sdate) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        ParsePosition pos = new ParsePosition(0);
        Date date = formatter.parse(sdate, pos);
        if(date == null) {
            throw new BookNotFoundException("日期like非法？", devsId);
            //前端应会得到这个反馈结果，　{data: null，errors: [{message: "日期like非法？", }]  }
        }
        EQP eQP = eQPRepository.findById(devsId).orElse(null);
        Assert.isTrue(eQP != null,"未找到eQP:"+eQP);
        Task task = new Task();
        List<EQP> devs=new ArrayList<>();
        devs.add(eQP);
        task.setDevs(devs);
        task.setDep(dep);
        task.setDate(date);
        taskRepository.save(task);
        return task;
    }

    @Transactional
    public Task addDeviceToTask(Long taskId,Long devId) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        Task task = taskRepository.findById(taskId).orElse(null);
        Assert.isTrue(task != null,"未找到task:"+task);
        EQP eQP = eQPRepository.findById(devId).orElse(null);
        Assert.isTrue(eQP != null,"未找到eQP:"+eQP);
        task.getDevs().add(eQP);
        taskRepository.save(task);
        return task;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public Unit newUnit(String name,String address) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        Unit unit = new Unit(name, address);
        unitRepository.save(unit);
        return unit;
    }
    //无需授权的入口型的函数，graphQL不要返回太多内容如User;
    @Transactional
    public boolean newUser(String name,String password,String dep,String mobile) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        User user = new User(name, dep);
        user.setPassword(password);
        user.setMobile(mobile);
        //前置条件验证
        // return false;
        userRepository.save(user);
        return true;    //都是成功，数据库保存不成功？ 底层就报错;
    }

    @Transactional
    public boolean logout() {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        if(auth==null)  return false;
        //"注销时，POST没有附带上 Bearer " 的，没有token,到底是谁啊,需要从OPTIONS才有知晓；或Cookie: token=；
        Object principal=auth.getPrincipal();
        if(principal instanceof JwtUser) {
            Long userid = ((JwtUser) principal).getId();
            User user = userRepository.findById(userid).orElse(null);
            UserDetails userDetails = jwtUserDetailsService.loadUserByUsername(user.getUsername());
            logger.info("user logout '{}', 注销退出了", user.getUsername());
            userRepository.save(user);
        }
        //没有登录的也Authenticated! 有anonymousUser 有ROLE_ANONYMOUS；
        SecurityContextHolder.getContext().setAuthentication(null);
        HttpServletResponse response=((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
        Cookie cookie =new Cookie("token", "");
        cookie.setDomain("localhost");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(1);
        cookie.setPath("/");
        response.addCookie(cookie);
        return true;
    }
    //graphQL操作返回结果类型不同的，要到调用的时候才能报错的。
    //用户登录：
    @Transactional
    public boolean authenticate(String name,String password) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        User user = userRepository.findByUsernameAndPassword(name, password);
        Assert.isTrue(user != null,"没user:"+name);
        logger.debug("checking authentication for user '{}'", name);
        if(user==null)  return false;
        if (name != null ) {         //&& SecurityContextHolder.getContext().getAuthentication() == null
            logger.debug("security context was null, so authorizating user");
            // It is not compelling necessary to load the use details from the database. You could also store the information
            // in the token and read it from it. It's up to you ;)
            UserDetails userDetails = jwtUserDetailsService.loadUserByUsername(name);
            // For simple validation it is completely sufficient to just check the token integrity. You don't have to call
            // the database compellingly. Again it's up to you ;)
            String token = jwtTokenUtil.generateToken(userDetails);     //jwtTokenUtil.validateToken(authToken, userDetails)
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
           HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();

           authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            logger.info("authorizated user '{}', setting security context", name);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            //浏览器自动遵守标准：超时的cookie就不会该送过来了。 那万一不守规矩？两手准备。
           HttpServletResponse response=((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
           Cookie cookie =new Cookie("token", token);
           cookie.setDomain("localhost");
           cookie.setHttpOnly(true);
           cookie.setMaxAge(5400);      //这个时间和token内部声称的时间不同，这给浏览器用的 = 1.5个小时。
           cookie.setPath("/");
           response.addCookie(cookie);
        }
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        Long  userid= ((JwtUser)(auth.getPrincipal())).getId();
        //返回权限列表
        return true;
    }

    @Transactional
    public EQP setEQPPosUnit(Long id,Long posId,Long ownerId,Long maintId) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        EQP eQP = eQPRepository.findById(id).orElse(null);
        Assert.isTrue(eQP != null,"未找到eQP:"+eQP);
        Position position= positionRepository.findById(posId).orElse(null);
        Unit ownerUnit= unitRepository.findById(ownerId).orElse(null);
        Unit maintUnit= unitRepository.findById(maintId).orElse(null);
        Assert.isTrue(position != null,"未找到position:"+position);
        Assert.isTrue(ownerUnit != null,"未找到ownerUnit:"+ownerUnit);
        eQP.setPos(position);
        eQP.setOwnerUnt(ownerUnit);
        eQP.setMaintUnt(maintUnit);
        eQPRepository.save(eQP);
        return eQP;
    }

    //设置基本设备信息; 参数和模型定义的同名接口的输入类型按顺序一致，否则Two different classes used for type
    @Transactional
    public EQP buildEQP(Long id, Long ownerId, DeviceCommonInput info) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        EQP eQP = eQPRepository.findById(id).orElse(null);
        Assert.isTrue(eQP != null,"未找到eQP:"+eQP);
        Position position= positionRepository.findByAddress(info.getAddress());
        if(position==null){
            position=new Position(info.getAddress(),"05910103","贵大厦");
            positionRepository.save(position);
        }
        Unit ownerUnit= unitRepository.findById(ownerId).orElse(null);
        Assert.isTrue(position != null,"未找到position:"+position);
        Assert.isTrue(ownerUnit != null,"未找到ownerUnit:"+ownerUnit);
        eQP.setPos(position);
        eQP.setOwnerUnt(ownerUnit);
        //修改数据的特别权限控制嵌入这里：
        eQP.setCod(info.getCod());
        eQP.setOid(info.getOid());
        eQPRepository.save(eQP);
        return eQP;
    }

    @Transactional
    public EQP testEQPModify(Long id,String oid) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        String  prevOid="is null";
        Map<String, Object>  properties1=emSei.getProperties();
        emSei.setProperty(JPA_SHARED_CACHE_RETRIEVE_MODE, CacheRetrieveMode.BYPASS);
        emSei.setProperty(JPA_SHARED_CACHE_STORE_MODE, CacheStoreMode.REFRESH);
        EQP eQP =eQPRepository.findById(id).orElse(null);
        if(eQP==null)   return  eQP;
        prevOid=eQP.getOid();
        eQP.setOid(oid);
        eQPRepository.save(eQP);
        return  eQP;
    }
    @Transactional
    public String testEQPFindModify(String cod,String oid) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        String  prevOid="is null";
        Map<String, Object>  properties1=emSei.getProperties();
        EQP eQP = eQPRepository.findByCod(cod);
        if(eQP==null)   return  prevOid;
        prevOid=eQP.getOid();
        eQP.setOid(oid);
        eQPRepository.save(eQP);
        return  prevOid;
    }
    @Transactional
    public String testEQPStreamModify(String cod,String oid) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        String  prevOid="not find,is null?";
        emSei.setProperty(JPA_SHARED_CACHE_RETRIEVE_MODE, CacheRetrieveMode.BYPASS);
        emSei.setProperty(JPA_SHARED_CACHE_STORE_MODE, CacheStoreMode.REFRESH);
        List<EQP> eqpList= eQPRepository.findAll();     //较慢:所有数据都装载了
        List<EQP> eqpObjs=eqpList.stream().filter(e -> e.getCod().equals(cod)).collect(Collectors.toList());
        for (EQP eQP:eqpObjs)
        {
            prevOid = eQP.getOid();
            eQP.setOid(oid);
            eQPRepository.save(eQP);
        }
        if(eqpObjs.size()>1)    prevOid="超过1个的eqp?";
        return  prevOid;
    }
    @Transactional
    public EQP testEQPCriteriaModify(String cod,String oid,String type) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        //必须加这2行，否则可能无法获取最新DB数据，可能不被认定为必须做DB更新。
        emSei.setProperty(JPA_SHARED_CACHE_RETRIEVE_MODE, CacheRetrieveMode.BYPASS);
        emSei.setProperty(JPA_SHARED_CACHE_STORE_MODE, CacheStoreMode.REFRESH);
        String  prevOid="not find,is null?";
        Pageable pageable = PageRequest.of(0, 50, Sort.by(Sort.Direction.ASC,"oid"));         //Integer.parseInt(10)
        Page<EQP> allPage=eQPRepository.findAll(new Specification<EQP>() {
            @Override
            public Predicate toPredicate(Root<EQP> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicateList = new ArrayList<Predicate>();
                if (!StringUtils.isEmpty(cod)) {
                    Path<String> p = root.get("cod");
                    predicateList.add(cb.like(p,"%" + cod + "%"));
                }
                if (!StringUtils.isEmpty(type)) {
                    Path<String> p = root.get("type");
                    predicateList.add(cb.equal(p,type));
                }
                Predicate[] predicates = new Predicate[predicateList.size()];
                predicateList.toArray(predicates);
                query.where(predicates);
                return null;
            }
        }, pageable);
        List<EQP>  eqpObjs= allPage.getContent();
        for (EQP eQP:eqpObjs)
        {
            prevOid = eQP.getOid();
            eQP.setOid(oid);
            eQPRepository.save(eQP);     //若缓存数据没有变换，这个不一定会提交给数据库？等于没干活。
        }
        if(eqpObjs.size()>1)    prevOid="超过1个的eqp?";
        return  eqpObjs.get(0);
    }
    @Transactional
    public String testEQPcreateQueryModify(String cod,String oid) {
        if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
        String  prevOid="is null";
        Map<String, Object>  properties1=emSei.getProperties();
        List<EQP> eQPs = emSei.createQuery(
                "select DISTINCT e from EQP e where id=2119", EQP.class)
                .getResultList();
        EQP  eQP= eQPs.get(0);
        if(eQP==null)   return  prevOid;
        prevOid=eQP.getOid();
        eQP.setOid(oid);
        eQPRepository.save(eQP);
        Map<String, Object>  properties2=emSei.getProperties();
        return  prevOid;
    }

}



/*
加了cache缓存后，为了在事务中读取数据库最新数据：emSei.find(EQP.class,id)或eQPRepository.findById(id)或eQPRepository.getOne(id)或findAll()；
                或eQPRepository.findAll(new Specification<EQP>() {@Override },pageable);
必须加  emSei.setProperty(JPA_SHARED_CACHE_RETRIEVE_MODE, CacheRetrieveMode.BYPASS);
        emSei.setProperty(JPA_SHARED_CACHE_STORE_MODE, CacheStoreMode.REFRESH); 加了这2条才能从DB去取最新数据。
而这些方法无需添加也能去数据库取最新数据：eQPRepository.findByCod(cod)或emSei.createQuery("")
*/

