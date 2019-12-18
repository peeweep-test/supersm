//
// Created by peeweep on 2019-12-18.
//

#ifndef SUPERSM_COMMON_H
#define SUPERSM_COMMON_H

#define VERSION 0.1;

#include <boost/program_options.hpp>
#include <filesystem>
#include <iostream>

class common {
 public:
  static void print_help_and_exit(
      const boost::program_options::options_description& description) {
    std::cout << "Super Symlinks Manager. [SuperSM] Version " << VERSION;
    std::cout << std::endl;
    std::cout << description;
    exit(1);
  }

  static boost::program_options::variables_map process_options(
      int argc, char const* argv[]) {
    std::string default_target = "DIR";

    // add options
    boost::program_options::options_description desc("Allowed options");
    desc.add_options()("version,v", "version message")(
        "SuperSM,s", "SuperSM directory")("help,h", "help message")(
        "target,t",
        boost::program_options::value<std::filesystem::path>()->default_value(
            default_target),
        "set target");

    // store map
    boost::program_options::variables_map variablesMap;

    // set as target if no options
    boost::program_options::positional_options_description p;
    p.add("target", -1);
    boost::program_options::store(
        boost::program_options::command_line_parser(argc, argv)
            .options(desc)
            .allow_unregistered()
            .positional(p)
            .run(),
        variablesMap);
    boost::program_options::notify(variablesMap);

    // print version and exit
    if (variablesMap.count("version")) {
      std::cout << VERSION;
      std::cout << std::endl;
      exit(1);
    }

    // print help and exit
    if (variablesMap.count("help") or argc <= 1)
      print_help_and_exit(desc);

    // print target and exit
    if (variablesMap["target"].as<std::filesystem::path>().string() !=
        default_target) {
      std::cout << "Target was set to "
                << variablesMap["target"].as<std::filesystem::path>()
                << std::endl;
      exit(1);
    }

    return variablesMap;
  }

 private:
};

#endif  // SUPERSM_COMMON_H
