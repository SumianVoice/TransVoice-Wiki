---
title: 声学共鸣（Acoustic Resonance）
parent: "杂项"
nav_order: 19
has_children: false
nav_exclude: true
---
<details closed markdown="block">
  <summary>
    目录
  </summary>
{: .text-delta }
1. TOC
{:toc}
</details>
<!-- remove nav_show: true when this is filled -->

# 声学共鸣（Acoustic Resonance）详解
## 驻波（Standing Waves）

{% include image.html file="/img/Waventerference.gif" alt="standing wave" max-width="300px"
caption="蓝色波向左传播，绿色波向右传播，它们的干涉形成了静止的红色波"
class="float-right" %}

驻波是一种固定在特定位置的波动。相较于普通的声波在空间中传播，驻波则停留在固定的位置。在人声中，驻波是由两个方向相反的声波干涉而形成的，正如上方的动画所示（图片来自 Wikipedia）。

声音传播过程中，涉及两个主要的波：由声带产生的声波入射波（incident wave），以及当入射波到达声道出口时产生的反射波（reflected wave），部分声波会因介质变化而反射回到声门（glottis），形成反射波。

## 波腹 与 波节（Nodes and Antinodes）
在驻波中，振幅最小的位置称为波节（nodes），振幅最大的地方称为波腹（antinodes）。在声音的上下文中，我们所指的振幅可以表示气压或体积速度（volume velocity）。气压波节（最低压力点） 对应于 体积速度波腹（最大气流运动），反之亦然。在声道的出口（空气流动最强烈的地方），总是会有一个气压波节。在声门处（glottis），则总是会有一个气压波腹。

## 干涉（Interference）
当声波在声道中传播并遇到其自身的反射波时（即驻波的形成过程），根据其特性，它可能会被削弱或增强。如果声波的波长与声道的共鸣特性匹配，并且在出口处具有最大的体积速度，则该波会被增强。最低频率的共鸣称为第一共振频率（First Resonance Frequency, F1），其波长约为声道长度的四倍。第二共振频率（Second Resonance Frequency, F2）的波长约为声道长度的 3/4，并且会在口咽（oropharynx）产生额外的波节/波腹对，其中波节位于前口腔（anterior oral cavity）。

## 扰动（Perturbation）
目前为止，我们只讨论了声道长度对共鸣的影响。然而，实际上的声道并不是一个直径均匀的简单管道，因此，共鸣频率不仅受长度影响，还受不同部位的收缩或扩张影响。在气压波腹（压力最大的位置）附近发生的收缩，会提高相应的共鸣频率。在气压波节（压力最小的位置）附近发生的收缩，会降低相应的共鸣频率。所有共鸣频率都会因以下收缩部位而发生变化：喉部（glottis）和嘴唇（lips）的收缩会提高所有共鸣频率。前口腔（anterior oral cavity）的收缩（如 /i/ 元音）会提高第二共振频率（F2）。后口腔或口咽（posterior oral cavity/oropharynx）的收缩（如 /u/ 元音）会降低第二共振频率（F2）。随着共鸣频率的提高，波节和波腹的数量也会增加，使得单独调整某个特定共鸣频率变得更加困难。因此，在实际应用中，很少有人讨论第三共振频率（R3/F3）以上的频率。
