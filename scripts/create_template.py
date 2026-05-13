import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side

wb = openpyxl.Workbook()

# ============ Sheet 1: 线路信息采集模板 ============
ws = wb.active
ws.title = "线路信息采集"

# Style definitions
header_font = Font(name="Microsoft YaHei", bold=True, size=11, color="FFFFFF")
category_font = Font(name="Microsoft YaHei", bold=True, size=11, color="FFFFFF")
normal_font = Font(name="Microsoft YaHei", size=10)
note_font = Font(name="Microsoft YaHei", size=9, color="666666", italic=True)

header_fill = PatternFill(start_color="2E7D32", end_color="2E7D32", fill_type="solid")
category_fill = PatternFill(start_color="66BB6A", end_color="66BB6A", fill_type="solid")
alt_fill = PatternFill(start_color="F1F8E9", end_color="F1F8E9", fill_type="solid")

thin_border = Border(
    left=Side(style="thin"),
    right=Side(style="thin"),
    top=Side(style="thin"),
    bottom=Side(style="thin"),
)

wrap_alignment = Alignment(wrap_text=True, vertical="top")
center_alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

# Column widths
ws.column_dimensions["A"].width = 18
ws.column_dimensions["B"].width = 20
ws.column_dimensions["C"].width = 45
ws.column_dimensions["D"].width = 45
ws.column_dimensions["E"].width = 50

# Title row
ws.merge_cells("A1:E1")
title_cell = ws["A1"]
title_cell.value = "径迹 — 徒步线路信息采集模板"
title_cell.font = Font(name="Microsoft YaHei", bold=True, size=16, color="2E7D32")
title_cell.alignment = Alignment(horizontal="center", vertical="center")
ws.row_dimensions[1].height = 40

# Header row
headers = ["分类", "字段名", "填写说明", "示例", "对装备推荐的影响"]
for col, header in enumerate(headers, 1):
    cell = ws.cell(row=2, column=col, value=header)
    cell.font = header_font
    cell.fill = header_fill
    cell.alignment = center_alignment
    cell.border = thin_border
ws.row_dimensions[2].height = 30

# Data - organized by category
data = [
    # 基本信息
    ("基本信息", "线路名称", "线路的通用名称", "冈仁波齐转山", "用于展示"),
    ("基本信息", "线路别名", "其他常用名称，多个用逗号分隔", "Kailash Kora / 仁波齐转山", "搜索优化"),
    ("基本信息", "所属省份", "省/自治区/直辖市/特别行政区", "西藏", "筛选和分组"),
    ("基本信息", "所属地区", "市/州/盟", "阿里地区", "筛选"),
    ("基本信息", "起点", "具体出发地点", "塔钦", "导航和交通规划"),
    ("基本信息", "终点", "线路结束地点（环线则与起点相同）", "塔钦", "导航和交通规划"),
    ("基本信息", "最近城镇", "距离最近的城镇，方便补给", "普兰县", "补给规划"),
    ("基本信息", "线路简介", "100-200字的整体介绍", "世界公认的神山，海拔4688米的卓玛拉山口是全程最高点...", "页面展示"),

    # 核心数据
    ("核心数据", "总距离(km)", "全程总公里数", "52", "决定鞋类和体能需求"),
    ("核心数据", "建议天数", "推荐完成天数", "3", "决定露营/住宿装备"),
    ("核心数据", "累计爬升(m)", "全程累计上升海拔", "2800", "决定体能需求和登山杖"),
    ("核心数据", "累计下降(m)", "全程累计下降海拔", "2800", "决定护膝需求"),
    ("核心数据", "最高海拔(m)", "全程最高点", "5630（卓玛拉山口）", "决定保暖装备和高反预防"),
    ("核心数据", "最低海拔(m)", "全程最低点", "4680", "温差计算"),
    ("核心数据", "平均海拔(m)", "大部分时间行走的海拔", "4800", "高反风险评估"),
    ("核心数据", "难度等级", "简单/中等/困难/极难", "中等", "整体装备水平参考"),

    # 地形与路况
    ("地形与路况", "主要地形", "多选：高山草甸/碎石坡/岩石/泥路/台阶/林间小道/沙漠/冰川/雪坡", "碎石坡、高山草甸、岩石", "决定鞋类选择"),
    ("地形与路况", "路面状况", "多选：铺装路/土路/碎石路/野路/栈道/涉水路段", "碎石路、土路、涉水路段", "决定鞋底类型和防水需求"),
    ("地形与路况", "技术难度", "是否有需要手脚并用的路段/攀爬/绳索辅助", "有，卓玛拉山口附近有简易攀爬路段", "决定是否需要技术装备"),
    ("地形与路况", "涉水情况", "是否需要过河/溪流，水深和流速", "有2处溪流横穿，水深约膝盖，流速中等", "决定是否需要溯溪鞋/登山杖"),
    ("地形与路况", "悬崖/暴露感", "是否有悬崖边缘、暴露感强的路段", "无明显悬崖路段", "决定是否恐高者需要心理准备"),
    ("地形与路况", "路标/标识", "路径标识是否清晰", "有经幡和玛尼堆标识，较清晰", "决定导航装备需求"),
    ("地形与路况", "危险路段", "落石区/塌方区/野兽出没区", "K2冰川附近有落石风险", "安全提醒和防护装备"),

    # 气候与天气
    ("气候与天气", "最佳季节", "适合徒步的月份", "5月-10月", "天气模拟的基准"),
    ("气候与天气", "最佳月份", "最推荐的月份", "6月、9月", "精准推荐"),
    ("气候与天气", "应避开的季节", "不建议前往的时段及原因", "7-8月雨季路滑，11-4月大雪封山", "安全提醒"),
    ("气候与天气", "典型日间温度(°C)", "白天温度范围", "10~20", "决定服装分层"),
    ("气候与天气", "典型夜间温度(°C)", "夜间温度范围", "-5~5", "决定睡袋和保暖装备"),
    ("气候与天气", "昼夜温差(°C)", "日间和夜间温差", "15~25", "决定服装分层策略"),
    ("气候与天气", "降水特点", "雨季时间/降水频率/突发天气", "午后常有阵雨，高海拔地区天气多变", "决定雨具需求"),
    ("气候与天气", "风力情况", "常见风力等级/风口位置", "山口风力可达6-7级", "决定防风装备"),
    ("气候与天气", "紫外线强度", "高/中/低", "极高，海拔4000m+紫外线强烈", "决定防晒装备"),

    # 补给与后勤
    ("补给与后勤", "沿途水源", "水源点数量和间距", "每5-8km有一处溪流水源", "决定携带水量"),
    ("补给与后勤", "水源是否可直饮", "是否需要净水设备", "建议使用净水片或过滤器", "决定净水装备"),
    ("补给与后勤", "沿途补给点", "是否有小卖部/客栈/餐厅", "塔钦有餐厅，止热寺有小卖部", "决定携带食物量"),
    ("补给与后勤", "住宿条件", "帐篷露营/山屋/客栈/酒店", "沿途有帐篷营地和简易客栈", "决定露营装备"),
    ("补给与后勤", "是否需要露营", "是/否", "是，推荐自带帐篷", "决定帐篷/睡袋/防潮垫"),
    ("补给与后勤", "手机信号", "全程/部分/无信号", "部分路段有4G信号", "决定导航方式"),
    ("补给与后勤", "充电条件", "沿途是否有充电点", "部分客栈可充电", "决定是否带充电宝"),

    # 交通与后勤
    ("交通与后勤", "如何到达起点", "飞机/火车/大巴到最近城市，再转车", "飞拉萨→包车到塔钦（约2天）", "行程规划"),
    ("交通与后勤", "如何从终点返回", "交通方式", "同起点返回", "行程规划"),
    ("交通与后勤", "是否需要向导", "是/否/强烈建议", "建议请当地向导，尤其是首次前往", "费用和安全"),
    ("交通与后勤", "是否需要许可证", "边防证/入山证/预约", "需要办理阿里地区边防证", "出行准备"),
    ("交通与后勤", "门票/费用", "门票、营地费等", "转山门票150元", "预算规划"),

    # 安全信息
    ("安全信息", "高反风险", "无/低/中/高/极高", "极高，全程海拔4500m以上", "决定高反预防装备和药物"),
    ("安全信息", "救援条件", "是否容易获得救援", "偏远地区救援困难，需自备急救", "决定急救装备"),
    ("安全信息", "最近医院", "最近医疗设施的距离", "普兰县医院，距塔钦约100km", "紧急情况参考"),
    ("安全信息", "紧急撤离路线", "是否可以中途退出", "有多处可搭车撤离的点", "安全规划"),
    ("安全信息", "野生动物", "可能遇到的动物", "可能遇到野狗、旱獭", "安全提醒"),
    ("安全信息", "注意事项", "其他安全提示", "尊重当地宗教习俗，顺时针转山", "安全提醒"),

    # 风景与体验
    ("风景与体验", "主要风景", "多选：雪山/冰川/湖泊/草甸/森林/峡谷/沙漠/花海/云海/瀑布", "雪山、冰川、高山湖泊", "页面展示"),
    ("风景与体验", "核心亮点", "2-3个最值得看的点", "卓玛拉山口、玛旁雍措湖", "页面展示"),
    ("风景与体验", "摄影点推荐", "最佳拍照位置", "止热寺可拍摄冈仁波齐北壁", "页面展示"),
    ("风景与体验", "日出/日落推荐", "最佳观景点", "祖楚寺是观看日出的好位置", "页面展示"),
    ("风景与体验", "文化/宗教特色", "相关文化背景", "藏传佛教、印度教、苯教共同圣地", "页面展示"),
    ("风景与体验", "拥挤程度", "旺季人多/适中/清静", "6-9月旺季人较多", "体验参考"),

    # 体能与经验要求
    ("体能与经验", "建议体能要求", "需要的体能水平", "良好心肺功能，能负重15kg日行15km", "用户匹配"),
    ("体能与经验", "建议户外经验", "需要的经验等级", "有高海拔徒步经验者优先", "用户匹配"),
    ("体能与经验", "每日平均行走时间", "每天实际行走小时数", "6-8小时/天", "体能规划"),
    ("体能与经验", "适合人群", "不适合哪些人", "不适合心脏病、严重高反史者", "安全提醒"),
]

row = 3
current_category = None
for category, field, desc, example, impact in data:
    if category != current_category:
        # Category separator row
        ws.merge_cells(f"A{row}:E{row}")
        cat_cell = ws.cell(row=row, column=1, value=category)
        cat_cell.font = category_font
        cat_cell.fill = category_fill
        cat_cell.alignment = Alignment(horizontal="center", vertical="center")
        for col in range(1, 6):
            ws.cell(row=row, column=col).border = thin_border
            ws.cell(row=row, column=col).fill = category_fill
        ws.row_dimensions[row].height = 28
        row += 1
        current_category = category

    fill = alt_fill if (row % 2 == 0) else None

    for col, value in enumerate([category, field, desc, example, impact], 1):
        cell = ws.cell(row=row, column=col, value=value)
        cell.font = normal_font
        cell.alignment = wrap_alignment
        cell.border = thin_border
        if fill:
            cell.fill = fill

    ws.row_dimensions[row].height = 35
    row += 1

# Note at the bottom
row += 1
ws.merge_cells(f"A{row}:E{row}")
note = ws.cell(row=row, column=1)
note.value = "提示：每条线路请单独复制一个 sheet 填写。标注「多选」的字段请用顿号分隔。对装备推荐有直接影响的字段请优先填写。"
note.font = note_font
note.alignment = Alignment(wrap_text=True)

# ============ Sheet 2: 示例填写 ============
ws2 = wb.create_sheet("示例 — 冈仁波齐转山")

ws2.column_dimensions["A"].width = 18
ws2.column_dimensions["B"].width = 20
ws2.column_dimensions["C"].width = 55

# Title
ws2.merge_cells("A1:C1")
ws2["A1"].value = "示例：冈仁波齐转山"
ws2["A1"].font = Font(name="Microsoft YaHei", bold=True, size=14, color="2E7D32")
ws2["A1"].alignment = Alignment(horizontal="center")
ws2.row_dimensions[1].height = 35

# Headers
for col, header in enumerate(["分类", "字段名", "填写内容"], 1):
    cell = ws2.cell(row=2, column=col, value=header)
    cell.font = header_font
    cell.fill = header_fill
    cell.alignment = center_alignment
    cell.border = thin_border

example_data = [
    ("基本信息", "线路名称", "冈仁波齐转山"),
    ("基本信息", "所属省份", "西藏"),
    ("基本信息", "所属地区", "阿里地区"),
    ("基本信息", "起点", "塔钦"),
    ("基本信息", "终点", "塔钦（环线）"),
    ("基本信息", "最近城镇", "普兰县"),
    ("核心数据", "总距离(km)", "52"),
    ("核心数据", "建议天数", "3"),
    ("核心数据", "累计爬升(m)", "约2800"),
    ("核心数据", "最高海拔(m)", "5630（卓玛拉山口）"),
    ("核心数据", "最低海拔(m)", "4680"),
    ("核心数据", "难度等级", "中等"),
    ("地形与路况", "主要地形", "碎石坡、高山草甸、岩石"),
    ("地形与路况", "路面状况", "碎石路、土路、涉水路段"),
    ("地形与路况", "技术难度", "卓玛拉山口附近有简易攀爬路段"),
    ("地形与路况", "涉水情况", "有2处溪流横穿，水深约膝盖"),
    ("气候与天气", "最佳季节", "5月-10月"),
    ("气候与天气", "典型日间温度(°C)", "10~20"),
    ("气候与天气", "典型夜间温度(°C)", "-5~5"),
    ("气候与天气", "降水特点", "午后常有阵雨，高海拔天气多变"),
    ("补给与后勤", "沿途水源", "每5-8km有溪流"),
    ("补给与后勤", "是否需要露营", "是，推荐自带帐篷"),
    ("补给与后勤", "手机信号", "部分路段有4G"),
    ("安全信息", "高反风险", "极高，全程海拔4500m以上"),
    ("安全信息", "救援条件", "偏远，需自备急救"),
    ("风景与体验", "主要风景", "雪山、冰川、高山湖泊"),
    ("风景与体验", "核心亮点", "卓玛拉山口、玛旁雍措湖"),
    ("体能与经验", "建议体能要求", "良好心肺，能负重15kg日行15km"),
    ("体能与经验", "建议户外经验", "有高海拔徒步经验"),
]

row = 3
current_cat = None
for cat, field, value in example_data:
    if cat != current_cat:
        ws2.merge_cells(f"A{row}:C{row}")
        cat_cell = ws2.cell(row=row, column=1, value=cat)
        cat_cell.font = category_font
        cat_cell.fill = category_fill
        cat_cell.alignment = Alignment(horizontal="center")
        for col in range(1, 4):
            ws2.cell(row=row, column=col).border = thin_border
            ws2.cell(row=row, column=col).fill = category_fill
        row += 1
        current_cat = cat

    fill = alt_fill if (row % 2 == 0) else None
    for col, v in enumerate([cat, field, value], 1):
        cell = ws2.cell(row=row, column=col, value=v)
        cell.font = normal_font
        cell.alignment = wrap_alignment
        cell.border = thin_border
        if fill:
            cell.fill = fill
    row += 1

# Save
wb.save("docs/trail-info-template.xlsx")
print("Excel file created successfully")
